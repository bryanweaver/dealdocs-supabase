export function isQuestionRequired(
  question: any,
  requiredFields: Array<any>,
): boolean {
  // If question has an intro, it's not required
  if (question.intro) {
    return false;
  }

  // Check if the field is in requiredFields
  if (question.sectionId && question.fieldId) {
    const requiredFieldsInThisSection = requiredFields?.[question.sectionId];
    if (
      requiredFieldsInThisSection &&
      !requiredFieldsInThisSection.includes(question.fieldId)
    ) {
      return false;
    }
  }
  return true;
  // if (!question.dependsOnAll && !question.dependsOnAny) {
  //   // If no dependencies, always required
  //   return true;
  // }

  // Check dependsOnAll dependencies
  // if (question.dependsOnAll) {
  //   const allDependenciesMet = question.dependsOnAll.every((dependency) => {
  //     const { fieldId, value, sectionId } = dependency;
  //     if (sectionId) {
  //       return formData[sectionId]?.[fieldId] === value;
  //     }
  //     return (
  //       formData[question.sectionId]?.[fieldId] === value ||
  //       formData[fieldId] === value
  //     );
  //   });
  //   if (!allDependenciesMet) {
  //     return false;
  //   }
  // }

  // Check dependsOnAny dependencies
  // if (question.dependsOnAny) {
  //   const anyDependencyMet = question.dependsOnAny.some((dependency) => {
  //     const { fieldId, value, sectionId } = dependency;
  //     if (sectionId) {
  //       return formData[sectionId]?.[fieldId] === value;
  //     }
  //     return (
  //       formData[question.sectionId]?.[fieldId] === value ||
  //       formData[fieldId] === value
  //     );
  //   });
  //   if (!anyDependencyMet) {
  //     return false;
  //   }
  // }
}
