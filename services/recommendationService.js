/**
 * Validates if all prerequisites for a given course have been completed.
 * @param {string} courseId - The ID of the course to check prerequisites for.
 * @param {string[]} completedCourses - An array of completed course IDs.
 * @param {object[]} allCourses - The list of all available course objects (fetched from DB).
 * @returns {boolean} - True if prerequisites are met, false otherwise.
 */
const validatePrerequisites = (courseId, completedCourses, allCourses) => {
  const course = allCourses.find((c) => c.id === courseId);
  if (!course) {
    // This might happen if course data is inconsistent
    console.warn(
      `validatePrerequisites: Course ${courseId} not found in provided course data.`
    );
    return false;
  }

  if (!course.prerequisites || course.prerequisites.length === 0) {
    return true; // No prerequisites
  }

  // Check if every prerequisite course ID is included in the completedCourses array
  return course.prerequisites.every((prereqId) =>
    completedCourses.includes(prereqId)
  );
};

/**
 * Generates required course recommendations for the next semester.
 * @param {string[]} completedCourses - An array of completed course IDs for the student.
 * @param {object[]} allCourses - The list of all available course objects (fetched from DB).
 * @param {object} curriculum - The curriculum rules object (fetched from DB).
 * @returns {string[]} - An array of recommended required course IDs.
 */
const generateRecommendation = (completedCourses, allCourses, curriculum) => {
  // 1. Identify remaining required courses
  const remainingRequired = curriculum.requiredCourses.filter(
    (reqId) => !completedCourses.includes(reqId)
  );

  // 2. Filter remaining required courses based on met prerequisites
  const recommendedRequired = remainingRequired.filter((courseId) =>
    validatePrerequisites(courseId, completedCourses, allCourses)
  );

  // Limit the number of suggestions (e.g., typical course load)
  const MAX_RECOMMENDATIONS = 5;
  const recommendations = [...recommendedRequired];

  // Remove duplicates (shouldn't be necessary but safe)
  const uniqueRecommendations = [...new Set(recommendations)];

  return uniqueRecommendations.slice(0, MAX_RECOMMENDATIONS);
};

module.exports = {
  generateRecommendation,
  validatePrerequisites,
};
