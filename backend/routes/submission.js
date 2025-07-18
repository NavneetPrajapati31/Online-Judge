const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  requireProfileComplete,
} = require("../middleware/auth");
const {
  createSubmission,
  getSubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/submission");

// Public routes
router.get("/", getSubmissions);
router.get("/problem/:problemId", authenticateJWT, getSubmissionsByProblem);
router.get("/:id", getSubmissionById);

// Protected routes
router.post("/", authenticateJWT, requireProfileComplete, createSubmission);
router.put("/:id", authenticateJWT, requireProfileComplete, updateSubmission);
router.delete(
  "/:id",
  authenticateJWT,
  requireProfileComplete,
  deleteSubmission
);

module.exports = router;
