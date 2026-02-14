const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const OpenAI = require("openai");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const port = Number(process.env.PORT) || 5001;

const firebaseKeyPath = path.join(__dirname, "firebase-admin-key.json");
const firebaseServiceAccount = require(firebaseKeyPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
}

const db = admin.firestore();

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openaiApiKey });
const openaiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function buildWeeklyPlanSchema(days) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["days"],
    properties: {
      days: {
        type: "array",
        minItems: days,
        maxItems: days,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["day", "dayType", "focus", "exercises"],
          properties: {
            day: { type: "string" },
            dayType: { type: "string", enum: ["training", "conditioning", "recovery", "rest"] },
            focus: { type: "string" },
            exercises: {
              type: "array",
              minItems: 1,
              maxItems: 6,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["name", "type", "sets", "reps", "seconds"],
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["reps", "time"] },
                  sets: { type: "number", minimum: 1 },
                  reps: {
                    type: ["number", "null"],
                    minimum: 1,
                  },
                  seconds: {
                    type: ["number", "null"],
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

function getCurrentWeekKey(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function isValidStartDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseDays(value, fallback = 7) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

function getPlanId(startDate, days) {
  return startDate ? `${startDate}-${days}` : getCurrentWeekKey();
}

async function generateWeeklyPlan({ savedWorkouts, goals, preferences, days }) {
  const weeklyPlanSchema = buildWeeklyPlanSchema(days);
  const completion = await openai.chat.completions.create({
    model: openaiModel,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "weekly_workout_plan",
        strict: true,
        schema: weeklyPlanSchema,
      },
    },
    messages: [
      {
        role: "system",
        content:
          `You are a workout planning coach. Return strict JSON only that matches the schema exactly, with no markdown or extra text. Build exactly ${days} days. Each day must include dayType: 'training' | 'conditioning' | 'recovery' | 'rest'. Enforce exercise counts by dayType: training days must have 4-6 exercises with a balanced mix appropriate to the focus (for example strength, hypertrophy, mobility, core, conditioning as applicable), conditioning days must have 3-5 movements and include a mix of time-based and rep-based work, and recovery/rest days must have 1-2 items maximum. For each exercise include name, type ('reps' or 'time'), sets, reps, and seconds. Use null for reps when type is 'time', and null for seconds when type is 'reps'.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          savedWorkouts: savedWorkouts || [],
          goals: goals || {},
          preferences: preferences || {},
        }),
      },
    ],
  });

  const rawContent = completion.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = JSON.parse(rawContent);
  if (!parsed || !Array.isArray(parsed.days) || parsed.days.length !== days) {
    throw new Error("OpenAI response failed plan validation.");
  }

  return parsed;
}

app.post("/generate-weekly-plan", async (req, res, next) => {
  try {
    const { userId, savedWorkouts, goals, preferences, startDate } = req.body || {};
    const days = parseDays(req.body?.days, 7);

    if (!openaiApiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required and must be a string." });
    }

    if (days === null) {
      return res.status(400).json({ error: "days must be a positive integer." });
    }

    if (startDate !== undefined && startDate !== null && !isValidStartDate(startDate)) {
      return res.status(400).json({ error: "startDate must be in YYYY-MM-DD format." });
    }

    const planId = getPlanId(startDate, days);
    const generatedPlan = await generateWeeklyPlan({ savedWorkouts, goals, preferences, days });

    const planToStore = {
      week: getCurrentWeekKey(),
      planId,
      userId,
      startDate: startDate || null,
      days,
      plan: generatedPlan,
      inputs: {
        savedWorkouts: savedWorkouts || [],
        goals: goals || {},
        preferences: preferences || {},
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userId).collection("plans").doc(planId).set(planToStore);

    res.status(200).json({
      week: planToStore.week,
      planId,
      startDate: startDate || null,
      days,
      plan: generatedPlan,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/weekly-plan/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { startDate } = req.query;
    const days = parseDays(req.query?.days, 7);

    if (days === null) {
      return res.status(400).json({ error: "days must be a positive integer." });
    }

    if (startDate !== undefined && startDate !== null && startDate !== "" && !isValidStartDate(startDate)) {
      return res.status(400).json({ error: "startDate must be in YYYY-MM-DD format." });
    }

    const planId = startDate ? getPlanId(startDate, days) : getCurrentWeekKey();

    const planDoc = await db.collection("users").doc(userId).collection("plans").doc(planId).get();

    if (!planDoc.exists) {
      return res.status(404).json({ error: "No weekly plan found for this user." });
    }

    res.status(200).json(planDoc.data());
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
