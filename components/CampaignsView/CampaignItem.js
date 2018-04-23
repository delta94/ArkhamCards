import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last, values } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import InvestigatorImage from '../core/InvestigatorImage';

class CampaignItem {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    latestMission: PropTypes.object,
    decks: PropTypes.array,
    investigators: PropTypes.array,
  };

  render() {
    const {
      campaign,
      latestMission,
      investigators,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          { map(investigators, card => (
            <InvestigatorImage key={card.id} card={card} />
          )) }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const latestMission = last(props.campaign.missionResults);
  const deckIds = latestMission ? latestMission.deckIds : [];
  const decks = [];
  forEach(deckIds, deckId => {
    const deck = state.decks.all[deckId];
    if (deck) {
      decks.push(deck);
    }
  });

  return {
    latestMission,
    decks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(CampaignItem), {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const query = map(
      props.decks || [],
      deck => `code == '${deck.investigator_code}'`
    ).join(' or ');

    const investigatorsMap = {};
    forEach(results.cards.filtered(query), card => {
      investigatorsMap[card.code] = card;
    });
    const investigators = [];
    forEach(props.decks || [], deck => {
      const card = investigatorsMap[deck.investigator_code];
      if (card) {
        investigators.push(card);
      }
    })
    return {
      investigators,
    };
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }
});