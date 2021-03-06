import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { ParsedDeck } from '@actions/types';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SlotsChart from './SlotsChart';
import SkillIconChart from './SkillIconChart';
import space from '@styles/space';
import COLORS from '@styles/colors';

const INCLUDE_SLOTS_CHART = false;

export interface DeckChartsProps {
  parsedDeck?: ParsedDeck;
}

type Props = DeckChartsProps & DimensionsProps;

class DeckChartsView extends React.Component<Props> {
  render() {
    const {
      parsedDeck,
      width,
    } = this.props;
    if (!parsedDeck) {
      return null;
    }
    return (
      <ScrollView contentContainerStyle={[
        styles.container,
        space.paddingSideS,
        space.paddingTopM,
      ]}>
        <SkillIconChart parsedDeck={parsedDeck} width={width - 16} />
        <CostChart parsedDeck={parsedDeck} width={width - 16} />
        { INCLUDE_SLOTS_CHART && <SlotsChart parsedDeck={parsedDeck} width={width - 16} /> }
        <FactionChart parsedDeck={parsedDeck} width={width - 16} />
      </ScrollView>
    );
  }
}

export default withDimensions(DeckChartsView);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 64,
    flexDirection: 'column',
    backgroundColor: COLORS.background,
  },
});
