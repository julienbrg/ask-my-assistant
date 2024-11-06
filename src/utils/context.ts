// Using Node.js filesystem operations during build time only
export const assistantContext = `# Assistant Persona: Francesca\n\n${require('../../public/sources/assistant-context.md')}`

export const julienBio = `# Julien's Bio\n\n${require('../../public/sources/julien-beranger-full-bio.md')}`

export const julienGithub = `# Julien's GitHub\n\n${require('../../public/sources/julien-beranger-github-readme-page.md')}`

// Combine all context
export const fullContext = [assistantContext, julienBio, julienGithub].join('\n\n')
