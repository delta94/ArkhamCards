import React from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import Card from 'data/Card';
import { CampaignLogEffect, BulletType } from 'data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';

interface Props {
  effect: CampaignLogEffect;
  input?: string[];
  numberInput?: number[];
  bulletType?: BulletType;
}

export default class CampaignLogEffectComponent extends React.Component<Props> {
  _renderCard = (card: Card, section: string) => {
    return (
      <CampaignGuideTextComponent
        text={t`In your Campaign Log, under "${section}", record ${card.name}. `}
      />
    );
  };

  renderContent() {
    const { effect } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          if (effect.id) {
            const logEntry = campaignGuide.logEntry(effect.section, effect.id);
            if (!logEntry) {
              return (
                <Text>
                  Unknown campaign log { effect.section }.
                </Text>
              );
            }
            switch (logEntry.type) {
              case 'text': {
                if (effect.cross_out) {
                  const text = (effect.section === 'campaign_notes') ?
                    t`In your Campaign Log, cross out <i>${logEntry.text}</i>` :
                    t`In your Campaign Log, under "${logEntry.section}", cross out <i>${logEntry.text}</i>`;
                  return (
                    <CampaignGuideTextComponent text={text} />
                  );
                }
                const text = (effect.section === 'campaign_notes') ?
                  t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
                  t`In your Campaign Log, under "${logEntry.section}", record that <i>${logEntry.text}</i>`;
                return (
                  <CampaignGuideTextComponent text={text} />
                );
              }
              case 'card': {
                return (
                  <SingleCardWrapper
                    code={logEntry.code}
                    render={this._renderCard}
                    extraArg={logEntry.section}
                  />
                );
              }
              case 'section_count': {
                // Not possible as a record
                return null;
              }
              case 'supplies': {
                // Not possible as a record?
                return null;
              }
            }
          }

          // No id, just a section / count
          const logSection = campaignGuide.logSection(effect.section);
          if (!logSection) {
            return (
              <Text>
                Unknown campaign log section { effect.section }.
              </Text>
            );
          }
          return <Text>Campaign Log Section: { logSection.section }</Text>;
        } }
      </CampaignGuideContext.Consumer>
    );
  }

  render() {
    const { bulletType, effect } = this.props;
    if (effect.section === 'hidden') {
      return null;
    }
    return (
      <SetupStepWrapper bulletType={bulletType}>
        { this.renderContent() }
      </SetupStepWrapper>
    );
  }
}
