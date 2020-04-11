import React from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import PickerComponent from './PickerComponent';
import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType, ChooseOneInput } from 'data/scenario/types';
import { chooseOneInputChoices } from 'data/scenario/inputHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import space from 'styles/space';

interface Props {
  id: string;
  campaignLog: GuidedCampaignLog;
  bulletType?: BulletType;
  text?: string;
  input: ChooseOneInput;
  optional?: boolean;
}

interface State {
  selectedChoice?: number;
}

export default class ChooseOnePrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;
  state: State = {};

  _onChoiceChange = (choice: number) => {
    this.setState({
      selectedChoice: choice,
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedChoice } = this.state;
    if (selectedChoice !== undefined) {
      this.context.scenarioState.setChoice(id, selectedChoice);
    }
  };

  render() {
    const { id, input, text, bulletType, campaignLog } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const decision = scenarioState.choice(id);
          const selectedChoice = decision !== undefined ? decision : this.state.selectedChoice;
          const choices = chooseOneInputChoices(input, campaignLog);
          return (
            <>
              { input.style === 'picker' ? (
                <PickerComponent
                  title={selectedChoice === undefined ? (text || '') : ''}
                  choices={choices}
                  selectedIndex={selectedChoice}
                  onChoiceChange={this._onChoiceChange}
                  editable={decision === undefined}
                  topBorder
                />
              ) : (
                <>
                  <SetupStepWrapper bulletType={bulletType}>
                    <CampaignGuideTextComponent
                      text={text || t`The investigators must decide (choose one):`}
                    />
                  </SetupStepWrapper>
                  <View style={space.paddingS}>
                    <ChooseOneListComponent
                      choices={choices}
                      selectedIndex={selectedChoice}
                      onSelect={this._onChoiceChange}
                      editable={decision === undefined}
                    />
                  </View>
                </>
              ) }
              { decision === undefined && (
                <BasicButton
                  title={t`Proceed`}
                  onPress={this._save}
                  disabled={selectedChoice === undefined}
                />
              ) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
