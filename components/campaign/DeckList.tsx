import React, { ReactNode } from 'react';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { Deck } from '../../actions/types';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { CardsMap } from '../../data/Card';

export interface DeckListProps  {
  componentId: string;
  campaignId: number;
  deckIds: number[];
  deckAdded?: (deck: Deck) => void;
  renderDeck: (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => ReactNode;
}

class DeckList extends React.Component<DeckListProps & PlayerCardProps> {
  _showDeckSelector = () => {
    const {
      deckIds,
      deckAdded,
      campaignId,
    } = this.props;
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps: {
              campaignId: campaignId,
              onDeckSelect: deckAdded,
              selectedDeckIds: deckIds,
            },
          },
        }],
      },
    });
  };

  render() {
    const {
      deckIds,
      deckAdded,
      cards,
      investigators,
      renderDeck,
    } = this.props;
    return (
      <View>
        { map(deckIds, deckId => (
          renderDeck(deckId, cards, investigators)
        )) }
        { !!deckAdded && (
          <View style={styles.button}>
            <Button title={L('Add Investigator')} onPress={this._showDeckSelector} />
          </View>
        ) }
      </View>
    );
  }
}

export default withPlayerCards(DeckList);

const styles = StyleSheet.create({
  button: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});