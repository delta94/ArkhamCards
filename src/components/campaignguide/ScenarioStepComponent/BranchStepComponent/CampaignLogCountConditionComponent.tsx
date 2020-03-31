import React from 'react';
import {
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import Card from 'data/Card';
import {
  BranchStep,
  CampaignLogCountCondition,
} from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCountCondition;
  campaignLog: GuidedCampaignLog;
}

// TODO: fix this.
export default class CampaignLogCountConditionComponent extends React.Component<Props> {
  getPrompt(campaignGuide: CampaignGuide, count: number) {
    const { condition, campaignLog } = this.props;
    const logEntry = campaignGuide.logEntry(condition.section, condition.id);
    switch (logEntry.type) {
      case 'section_count':
        if (campaignLog.countSections[condition.section]) {
          return ngettext(
            msgid`Check Campaign Log. Because there is ${count} mark under '${logEntry.section}'`,
            `Check Campaign Log. Because there are ${count} marks under '${logEntry.section}'`,
            count
          );
        }
        return ngettext(
          msgid`Check Campaign Log. Because there is ${count} entry under '${logEntry.section}'`,
          `Check Campaign Log. Because there are ${count} entries under '${logEntry.section}'`,
          count
        );
      case 'text': {
        return t`Check Campaign Log. Because <i>${logEntry.text.replace('#X#', `${count}`)}</i>`;
      }
      default:
        return 'Some other count condition';
    }
  }

  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          const count = campaignLog.count(condition.section, condition.id);
          return (
            <SetupStepWrapper bulletType={step.bullet_type}>
              <CardTextComponent
                text={this.getPrompt(campaignGuide, count)}
              />
            </SetupStepWrapper>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}