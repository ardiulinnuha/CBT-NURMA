/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePercentageLevel,
  calculateRubricLevel,
  evaluateTahfizLevel,
  calculateInterestModuleJ,
  calculateLearningStyleModulK,
  calculateBoardingReadinessModulK,
  calculatePsychosocialModulL,
  evaluateLearningFlags,
  getDifferentiationRecommendations,
} from './scoring';

test('calculatePercentageLevel returns Dasar, Cakap, Mahir correctly', () => {
  // < 50 -> Dasar
  const low = calculatePercentageLevel(4, 10);
  assert.equal(low.percent, 40);
  assert.equal(low.level, 'Dasar');

  // 50-79 -> Cakap
  const mid1 = calculatePercentageLevel(5, 10);
  assert.equal(mid1.percent, 50);
  assert.equal(mid1.level, 'Cakap');

  const mid2 = calculatePercentageLevel(7, 10);
  assert.equal(mid2.percent, 70);
  assert.equal(mid2.level, 'Cakap');

  // >= 80 -> Mahir
  const high = calculatePercentageLevel(8, 10);
  assert.equal(high.percent, 80);
  assert.equal(high.level, 'Mahir');

  const high2 = calculatePercentageLevel(10, 10);
  assert.equal(high2.percent, 100);
  assert.equal(high2.level, 'Mahir');
});

test('calculateRubricLevel correctly categorizes rubric averages', () => {
  assert.equal(calculateRubricLevel(1.8), 'Dasar');
  assert.equal(calculateRubricLevel(2.0), 'Cakap');
  assert.equal(calculateRubricLevel(2.8), 'Cakap');
  assert.equal(calculateRubricLevel(3.0), 'Cakap');
  assert.equal(calculateRubricLevel(3.1), 'Mahir');
});

test('evaluateTahfizLevel flags murajaah need if fluency < 2.0', () => {
  const resultLow = evaluateTahfizLevel('G1', 1.5);
  assert.equal(resultLow.needMurajaahBoost, true);

  const resultOk = evaluateTahfizLevel('G2', 3.2);
  assert.equal(resultOk.needMurajaahBoost, false);
});

test('calculateInterestModuleJ identifies dominant and mixed clusters', () => {
  const single = calculateInterestModuleJ({ IPA: 12, IPS: 8, Bahasa: 7, Keagamaan: 5 });
  assert.equal(single.dominant, 'IPA');
  assert.equal(single.isMixed, false);

  // Difference <= 1 between top 2 gives Campuran
  const mixed = calculateInterestModuleJ({ IPA: 11, IPS: 10, Bahasa: 6, Keagamaan: 4 });
  assert.equal(mixed.isMixed, true);
  assert.equal(mixed.dominant, 'Campuran (IPA/IPS)');
});

test('calculateLearningStyleModulK classifies VAK and mixed', () => {
  const visual = calculateLearningStyleModulK({ visual: 8, auditory: 5, kinesthetic: 4 });
  assert.equal(visual.dominant, 'Visual');
  assert.equal(visual.isMixed, false);

  const mixed = calculateLearningStyleModulK({ visual: 7, auditory: 7, kinesthetic: 4 });
  assert.equal(mixed.dominant, 'Campuran');
  assert.equal(mixed.isMixed, true);
});

test('calculateBoardingReadinessModulK computes totals and triggers K11 motivation flag', () => {
  // Sum < 16 -> Rendah
  const low = calculateBoardingReadinessModulK([1, 2, 2, 2, 2, 2, 1, 2], 2);
  assert.equal(low.level, 'Rendah');
  assert.equal(low.hasMotivationFlag, true);

  // Sum 16-24 -> Sedang
  const mid = calculateBoardingReadinessModulK([3, 3, 2, 3, 2, 2, 3, 2], 3);
  assert.equal(mid.level, 'Sedang');
  assert.equal(mid.hasMotivationFlag, false);

  // Sum > 24 -> Siap
  const high = calculateBoardingReadinessModulK([4, 4, 3, 4, 3, 4, 3, 3], 4);
  assert.equal(high.level, 'Siap');
  assert.equal(high.hasMotivationFlag, false);
});

test('calculatePsychosocialModulL handles normal, pantau, rujuk and critical items', () => {
  // 12 items: 10 direct + 2 inverted (items 11 & 12)
  // Low score -> Normal
  const normalItems = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const resNormal = calculatePsychosocialModulL(normalItems, 'tidak', 'tidak');
  assert.equal(resNormal.totalScore, 3);
  assert.equal(resNormal.status, 'Normal');
  assert.equal(resNormal.isCritical, false);

  // High score >= 15 with critical alert L-K1
  const highItems = [2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1];
  const resCritical = calculatePsychosocialModulL(highItems, 'pernah berpikir menyakiti diri', 'tidak');
  assert.equal(resCritical.totalScore, 17);
  assert.equal(resCritical.status, 'Rujuk BK');
  assert.equal(resCritical.isCritical, true);
  assert.equal(resCritical.criticalReasons.length, 1);
});

test('evaluateLearningFlags accurately identifies reading-writing, numeracy, and attention flags', () => {
  // Reading-writing difficulty (B < 50 and N < 2.0 and E < 50)
  const flags = evaluateLearningFlags({
    scoreBPercent: 42,
    scoreNRubric: 1.6,
    scoreEPercent: 36,
    scoreCPercent: 65,
  });

  const litFlag = flags.find((f) => f.jenis === 'literasi');
  assert.ok(litFlag, 'Literacy screening flag should be present');
  assert.ok(litFlag.catatan.includes('skrining, bukan diagnosis'));

  // Numeracy difficulty (C < 50 and B >= 50 and E >= 50)
  const numFlags = evaluateLearningFlags({
    scoreBPercent: 75,
    scoreNRubric: 2.8,
    scoreEPercent: 70,
    scoreCPercent: 45,
  });
  const numFlag = numFlags.find((f) => f.jenis === 'numerasi');
  assert.ok(numFlag, 'Numeracy screening flag should be present');
});
