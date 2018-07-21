import {
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
} from '../../actions/types';

export function newCampaign(
  id,
  name,
  pack_code,
  difficulty,
  deckIds,
  chaosBag,
  campaignLog,
  weaknessPacks
) {
  return {
    type: NEW_CAMPAIGN,
    id,
    name: name,
    cycleCode: pack_code,
    difficulty,
    chaosBag,
    campaignLog,
    weaknessPacks,
    deckIds,
    now: new Date(),
  };
}

/**
 * Pass only the fields that you want to update.
 *
 * chaosBag, campaignNotes, investigatorData, latestDeckIds, weaknessSet
 */
export function updateCampaign(
  id,
  sparseCampaign,
) {
  return {
    type: UPDATE_CAMPAIGN,
    id,
    campaign: sparseCampaign,
  };
}

export function deleteCampaign(id) {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}


// deckIds: [],
// scenario: '',
// scenarioCode: '',
// campaignNotes: [],
// investigatorUpdates: {
//   investigator_code: {
//     trauma: {
//       physical,
//       mental,
//     },
//     xp: #,
//     killed: bool,
//     insane: bool,
//     exile: {},
//   },
//   investigator_code: {
//     ...
//   }
// }],
export function addScenarioResult(
  id,
  latestDeckIds,
  deckIds,
  { scenario, scenarioCode, resolution },
  investigatorData,
) {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    latestDeckIds,
    investigatorData,
    scenarioResult: {
      deckIds,
      scenario,
      scenarioCode,
      resolution,
    },
    now: new Date(),
  };
}

export default {
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
};
