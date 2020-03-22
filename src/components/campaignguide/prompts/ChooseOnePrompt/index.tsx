import React from 'react';
import { Button, Text } from 'react-native';
import { t } from 'ttag';

import ChooseOneListComponent from '../ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, Choice } from 'data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  choices: Choice[];
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

  renderResults(selectedChoice: number) {
    const { choices } = this.props;
    const choice = choices[selectedChoice];
    if (choice.steps) {
      return null;
    }
    return <Text>Unknown results for choice</Text>;
  }

  render() {
    const { id, choices, text, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasChoice(id);
          const selectedChoice = hasDecision ?
            scenarioState.choice(id) :
            this.state.selectedChoice;
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                <CardTextComponent
                  text={text || t`The investigators must decide (choose one)`}
                />
              </SetupStepWrapper>
              <ChooseOneListComponent
                choices={choices}
                selectedIndex={selectedChoice}
                onSelect={this._onChoiceChange}
                editable={!hasDecision}
              />
              { hasDecision ? (
                this.renderResults(scenarioState.choice(id))
              ) : (
                <Button
                  title={t`Save`}
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