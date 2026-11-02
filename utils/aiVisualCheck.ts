import { Page, TestInfo } from '@playwright/test';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export interface VisualAnalysisResult {
  status: 'ANALYZED' | 'SKIPPED_API_ERROR';
  hasVisualBug?: boolean;
  explanation: string;
}

/**
 * Executes an advisory AI visual audit.
 * Does NOT throw hard assertions on API failures or minor UI anomalies.
 * Attaches the visual analysis directly to the Playwright HTML test report.
 */
export async function auditVisualUI(
  page: Page,
  componentName: string,
  testInfo: TestInfo
): Promise<VisualAnalysisResult> {
  try {
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    const base64Image = screenshotBuffer.toString('base64');

    const prompt = `
    Analyze this UI component named "${componentName}".
    Provide a concise QA analysis of layout alignment, text readability, and visual structure.

    Respond strictly in raw JSON format with no markdown wrappers:
    {
      "hasVisualBug": boolean,
      "explanation": "Concise assessment of visual layout and potential anomalies."
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: { mimeType: 'image/png', data: base64Image },
            },
          ],
        },
      ],
    });

    const responseText = response.text || '{}';
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanedJson);

    const auditOutput: VisualAnalysisResult = {
      status: 'ANALYZED',
      hasVisualBug: result.hasVisualBug ?? false,
      explanation: result.explanation || 'No issues detected.',
    };

    console.log(`\n🤖 [AI Visual Audit: ${componentName}]`);
    console.log(`Status: ${auditOutput.status}`);
    console.log(`Analysis: ${auditOutput.explanation}\n`);

    // Attach AI analysis directly to Playwright HTML Report
    await testInfo.attach(`AI Visual Audit - ${componentName}`, {
      body: JSON.stringify(auditOutput, null, 2),
      contentType: 'application/json',
    });

    return auditOutput;

  } catch (error: any) {
    // Graceful Fallback: Handle 503s or rate limits without failing the CI test
    const fallbackMessage = `AI Visual Audit Skipped due to API Availability: ${error.message || error}`;
    
    console.warn(`[AI Audit Warning] ${fallbackMessage}`);

    await testInfo.attach(`AI Visual Audit - ${componentName} (Skipped)`, {
      body: fallbackMessage,
      contentType: 'text/plain',
    });

    return {
      status: 'SKIPPED_API_ERROR',
      explanation: fallbackMessage,
    };
  }
}