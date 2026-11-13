import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log('====================================================');
  console.log('🏛️  CAMPUS OS — Backend REST API Server');
  console.log('====================================================');
  console.log(`📡 Server listening on: http://localhost:${env.PORT}`);
  console.log(`🌐 Client URL:         ${env.CLIENT_URL}`);
  console.log(`🤖 Gemini AI Model:    ${env.GEMINI_MODEL}`);
  console.log(`📐 Vector Model:       ${env.GEMINI_EMBEDDING_MODEL} (768d)`);
  console.log(`⚙️  Environment:        ${env.NODE_ENV}`);
  console.log('====================================================\n');
});

