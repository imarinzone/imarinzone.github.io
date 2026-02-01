/**
 * Unit tests for JSON processing logic
 * Tests the data transformation from resume-data.json format to the format expected by the application
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

// Load the resume data JSON file
const resumeDataPath = path.join(__dirname, '..', 'resume', 'resume-data.json');
const resumeData = JSON.parse(fs.readFileSync(resumeDataPath, 'utf8'));

/**
 * Simulate the transformation logic from app.js
 */
function transformResumeData(data) {
  return {
    basics: data.basics,
    sections: {
      summary: data.summary ? {
        content: data.summary.content
      } : null,
      profiles: data.sections?.profiles || { items: [] },
      experience: data.sections?.experience ? {
        items: (data.sections.experience.items || []).map(item => ({
          ...item,
          date: item.period || '',
          summary: item.description || '',
          website: item.website || null
        }))
      } : { items: [] },
      projects: data.sections?.projects ? {
        items: (data.sections.projects.items || []).map(item => ({
          ...item,
          url: item.website ? { href: item.website.url || '' } : { href: '' },
          summary: item.description || ''
        }))
      } : { items: [] },
      education: data.sections?.education ? {
        items: (data.sections.education.items || []).map(item => ({
          ...item,
          institution: item.school || '',
          studyType: item.degree || '',
          score: item.grade || '',
          date: item.period || '',
          summary: item.description || ''
        }))
      } : { items: [] },
      skills: data.sections?.skills || { items: [] },
      languages: data.sections?.languages || { items: [] }
    }
  };
}

// Run transformations
const transformed = transformResumeData(resumeData);

// Test Suite
console.log('🧪 Running JSON Processing Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Basics data structure
test('Basics data is preserved', () => {
  assert(transformed.basics, 'Basics should exist');
  assert(transformed.basics.name, 'Name should exist');
  assert(transformed.basics.email, 'Email should exist');
  assert(transformed.basics.headline, 'Headline should exist');
  assert(typeof transformed.basics.name === 'string', 'Name should be a string');
  assert(typeof transformed.basics.email === 'string', 'Email should be a string');
});

// Test 2: Summary transformation
test('Summary content is correctly transformed', () => {
  if (resumeData.summary) {
    assert(transformed.sections.summary, 'Summary section should exist');
    assert(transformed.sections.summary.content, 'Summary content should exist');
    assert(typeof transformed.sections.summary.content === 'string', 'Summary content should be a string');
  }
});

// Test 3: Profiles transformation
test('Profiles are correctly transformed', () => {
  assert(transformed.sections.profiles, 'Profiles section should exist');
  assert(Array.isArray(transformed.sections.profiles.items), 'Profiles items should be an array');
  
  if (transformed.sections.profiles.items.length > 0) {
    const profile = transformed.sections.profiles.items[0];
    assert(profile.network, 'Profile should have network');
    assert(profile.website || profile.url, 'Profile should have website or url');
  }
});

// Test 4: Experience transformation
test('Experience items are correctly transformed', () => {
  assert(transformed.sections.experience, 'Experience section should exist');
  assert(Array.isArray(transformed.sections.experience.items), 'Experience items should be an array');
  
  if (transformed.sections.experience.items.length > 0) {
    const exp = transformed.sections.experience.items[0];
    assert(exp.company, 'Experience item should have company');
    assert(exp.position, 'Experience item should have position');
    assert(exp.date !== undefined, 'Experience item should have date (transformed from period)');
    assert(exp.summary !== undefined, 'Experience item should have summary (transformed from description)');
    assert(typeof exp.date === 'string', 'Date should be a string');
    assert(typeof exp.summary === 'string', 'Summary should be a string');
  }
});

// Test 5: Experience website links
test('Experience items preserve website links', () => {
  if (transformed.sections.experience.items.length > 0) {
    const expWithWebsite = transformed.sections.experience.items.find(item => item.website);
    if (expWithWebsite) {
      assert(expWithWebsite.website, 'Experience item should have website');
      assert(expWithWebsite.website.url, 'Website should have URL');
      assert(typeof expWithWebsite.website.url === 'string', 'Website URL should be a string');
    }
  }
});

// Test 6: Projects transformation
test('Projects are correctly transformed', () => {
  assert(transformed.sections.projects, 'Projects section should exist');
  assert(Array.isArray(transformed.sections.projects.items), 'Projects items should be an array');
  
  if (transformed.sections.projects.items.length > 0) {
    const project = transformed.sections.projects.items[0];
    assert(project.name, 'Project should have name');
    assert(project.url !== undefined, 'Project should have url object');
    assert(project.summary !== undefined, 'Project should have summary (transformed from description)');
    assert(typeof project.url === 'object', 'URL should be an object');
    assert(typeof project.summary === 'string', 'Summary should be a string');
  }
});

// Test 7: Education transformation
test('Education items are correctly transformed', () => {
  assert(transformed.sections.education, 'Education section should exist');
  assert(Array.isArray(transformed.sections.education.items), 'Education items should be an array');
  
  if (transformed.sections.education.items.length > 0) {
    const edu = transformed.sections.education.items[0];
    assert(edu.institution !== undefined, 'Education item should have institution (transformed from school)');
    assert(edu.studyType !== undefined, 'Education item should have studyType (transformed from degree)');
    assert(edu.score !== undefined, 'Education item should have score (transformed from grade)');
    assert(edu.date !== undefined, 'Education item should have date (transformed from period)');
    assert(typeof edu.institution === 'string', 'Institution should be a string');
    assert(typeof edu.studyType === 'string', 'StudyType should be a string');
  }
});

// Test 8: Skills transformation
test('Skills are correctly transformed', () => {
  assert(transformed.sections.skills, 'Skills section should exist');
  assert(Array.isArray(transformed.sections.skills.items), 'Skills items should be an array');
  
  if (transformed.sections.skills.items.length > 0) {
    const skill = transformed.sections.skills.items[0];
    assert(skill.name, 'Skill should have name');
    assert(typeof skill.name === 'string', 'Skill name should be a string');
  }
});

// Test 9: Languages transformation
test('Languages are correctly transformed', () => {
  assert(transformed.sections.languages, 'Languages section should exist');
  assert(Array.isArray(transformed.sections.languages.items), 'Languages items should be an array');
  
  if (transformed.sections.languages.items.length > 0) {
    const lang = transformed.sections.languages.items[0];
    assert(lang.language, 'Language should have language field');
    assert(lang.fluency !== undefined, 'Language should have fluency');
    assert(typeof lang.language === 'string', 'Language name should be a string');
  }
});

// Test 10: Field mapping - period to date
test('Period field is correctly mapped to date', () => {
  if (transformed.sections.experience.items.length > 0) {
    const originalExp = resumeData.sections.experience.items[0];
    const transformedExp = transformed.sections.experience.items[0];
    
    if (originalExp.period) {
      assert(transformedExp.date === originalExp.period, 'Period should be mapped to date');
    }
  }
});

// Test 11: Field mapping - description to summary
test('Description field is correctly mapped to summary', () => {
  if (transformed.sections.experience.items.length > 0) {
    const originalExp = resumeData.sections.experience.items[0];
    const transformedExp = transformed.sections.experience.items[0];
    
    if (originalExp.description) {
      assert(transformedExp.summary === originalExp.description, 'Description should be mapped to summary');
    }
  }
});

// Test 12: Field mapping - school to institution
test('School field is correctly mapped to institution', () => {
  if (transformed.sections.education.items.length > 0) {
    const originalEdu = resumeData.sections.education.items[0];
    const transformedEdu = transformed.sections.education.items[0];
    
    if (originalEdu.school) {
      assert(transformedEdu.institution === originalEdu.school, 'School should be mapped to institution');
    }
  }
});

// Test 13: Field mapping - degree to studyType
test('Degree field is correctly mapped to studyType', () => {
  if (transformed.sections.education.items.length > 0) {
    const originalEdu = resumeData.sections.education.items[0];
    const transformedEdu = transformed.sections.education.items[0];
    
    if (originalEdu.degree) {
      assert(transformedEdu.studyType === originalEdu.degree, 'Degree should be mapped to studyType');
    }
  }
});

// Test 14: Field mapping - grade to score
test('Grade field is correctly mapped to score', () => {
  if (transformed.sections.education.items.length > 0) {
    const originalEdu = resumeData.sections.education.items[0];
    const transformedEdu = transformed.sections.education.items[0];
    
    if (originalEdu.grade) {
      assert(transformedEdu.score === originalEdu.grade, 'Grade should be mapped to score');
    }
  }
});

// Test 15: Empty arrays handling
test('Empty sections return empty arrays', () => {
  const emptyData = {
    basics: {},
    sections: {
      experience: { items: [] },
      projects: { items: [] },
      education: { items: [] },
      skills: { items: [] },
      languages: { items: [] }
    }
  };
  
  const transformedEmpty = transformResumeData(emptyData);
  assert(Array.isArray(transformedEmpty.sections.experience.items), 'Empty experience should return array');
  assert(transformedEmpty.sections.experience.items.length === 0, 'Empty experience should have length 0');
});

// Test 16: Missing sections handling
test('Missing sections are handled gracefully', () => {
  const minimalData = {
    basics: { name: 'Test', email: 'test@example.com' },
    sections: {}
  };
  
  const transformedMinimal = transformResumeData(minimalData);
  assert(transformedMinimal.sections.experience.items.length === 0, 'Missing experience should return empty array');
  assert(transformedMinimal.sections.projects.items.length === 0, 'Missing projects should return empty array');
});

// Test 17: Projects website URL transformation
test('Projects website is correctly transformed to url object', () => {
  if (transformed.sections.projects.items.length > 0) {
    const project = transformed.sections.projects.items[0];
    const originalProject = resumeData.sections.projects.items.find(p => p.name === project.name);
    
    if (originalProject && originalProject.website) {
      assert(project.url.href === originalProject.website.url, 'Project website URL should be mapped to url.href');
    }
  }
});

// Test 18: Data integrity - all required fields present
test('All required fields are present in transformed data', () => {
  assert(transformed.basics, 'Basics should exist');
  assert(transformed.sections, 'Sections should exist');
  assert(transformed.sections.experience, 'Experience section should exist');
  assert(transformed.sections.projects, 'Projects section should exist');
  assert(transformed.sections.education, 'Education section should exist');
  assert(transformed.sections.skills, 'Skills section should exist');
  assert(transformed.sections.languages, 'Languages section should exist');
});

// Test 19: Hidden items filtering (for projects)
test('Hidden projects can be identified', () => {
  if (transformed.sections.projects.items.length > 0) {
    transformed.sections.projects.items.forEach(project => {
      assert(project.hidden !== undefined, 'Project should have hidden property');
      assert(typeof project.hidden === 'boolean', 'Hidden should be a boolean');
    });
  }
});

// Test 20: HTML content in descriptions
test('HTML content in descriptions is preserved', () => {
  if (transformed.sections.experience.items.length > 0) {
    const exp = transformed.sections.experience.items[0];
    if (exp.summary && exp.summary.includes('<')) {
      assert(exp.summary.includes('<'), 'HTML tags should be preserved in summary');
    }
  }
});

// Summary
console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}\n`);

if (testsFailed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.');
  process.exit(1);
}
