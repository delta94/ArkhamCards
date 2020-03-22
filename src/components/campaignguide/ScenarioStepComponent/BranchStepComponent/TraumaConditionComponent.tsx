import React from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import BinaryPrompt from '../../prompts/BinaryPrompt';
import {
  BranchStep,
  TraumaCondition,
} from 'data/scenario/types';

interface Props {
  step: BranchStep;
  condition: TraumaCondition;
}

export default class TraumaConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition } = this.props;
    switch (condition.trauma) {
      case 'killed':
        switch (condition.investigator) {
          case 'lead_investigator':
            return (
              <BinaryPrompt
                id={step.id}
                text={t`Was the lead investigator <b>killed</b>?`}
                trueResult={find(condition.options, option => option.boolCondition === true)}
                falseResult={find(condition.options, option => option.boolCondition === false)}
              />
            );
          case 'all':
            return (
              <BinaryPrompt
                id={step.id}
                text={t`Were all investigators <b>killed</b>?`}
                trueResult={find(condition.options, option => option.boolCondition === true)}
                falseResult={find(condition.options, option => option.boolCondition === false)}
              />
            );
        }
    }
  }
}
