import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map, range } from 'lodash';
const {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = require('react-native');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CORE_FACTION_CODES, FACTION_COLORS, SKILLS, SKILL_COLORS } from '../../constants';
import { OptionalCardType } from './types';
import ArkhamIcon from '../../assets/ArkhamIcon';
import * as Actions from '../../actions';

import CardText from './CardText';

const PER_INVESTIGATOR_ICON = (
  <ArkhamIcon
    name="per_investigator"
    size={12}
    color="#000000"
  />
);

class CardDetailView extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    card: OptionalCardType,
  };

  renderMetadata(card) {
    return (
      <View style={styles.metaContainer}>
        <Text>
          { (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
            <ArkhamIcon name={card.faction_code} size={18} color="#000000" /> }
          { card.faction_name }
        </Text>
        <Text style={styles.typeText}>
          { card.subtype_name ?
            `${card.type_name}. ${card.subtype_name}` :
            card.type_name }
        </Text>
        { !!card.traits && <Text style={styles.traitsText}>{ card.traits }</Text> }
      </View>
    );
  }

  renderTestIcons(card) {
    const skills = flatMap(SKILLS, skill => {
      const count = card[`skill_${skill}`] || 0;
      return range(0, count).map(() => skill);
    });

    if (skills.length === 0) {
      return null;
    }
    return (
      <Text>
        { 'Test Icons:' }
        { map(skills, (skill, idx) => (
          <ArkhamIcon
            key={idx}
            name={skill}
            size={16}
            color={SKILL_COLORS[skill]}
          />))
        }
      </Text>
    );
  }

  renderPlaydata(card) {
    const costString =(
      (card.type_code === 'asset' || card.type_code === 'event') &&
      `Cost: ${card.cost || '-'}`
    ) || '';

    return (
      <View>
        <Text>
          {
            card.xp ?
              (`${costString}${costString ? '. ' : ''}XP: ${card.xp}.`) :
              costString
          }
        </Text>
        { this.renderTestIcons(card) }
        { this.renderHealthAndSanity(card) }
        { card.type_code === 'location' && (
          <Text>
            Shroud: {card.shroud}. Clues: {card.clues}
            { card.clues > 0 && !card.clues_fixed && PER_INVESTIGATOR_ICON }
            .
          </Text>
        )}
      </View>
    );
  }

  renderHealthAndSanity(card) {
    if (card.type_code === 'enemy') {
      return (
        <Text>
          { `Fight: ${card.enemy_fight || '-'}. Health: ${card.health || '-'}` }
          { card.health_per_investigator && PER_INVESTIGATOR_ICON }
          { `. Evade: ${card.enemy_evade || '-'}. `}
          { '\n' }
          { `Damage: ${card.enemy_damage || '-'}. Horror: ${card.enemy_horror}. ` }
        </Text>
      )
    }
    if (card.health > 0 || card.sanity > 0) {
      return (
        <Text>
          { `Health: ${card.health || '-'}. Sanity: ${card.sanity || '-'}.` }
        </Text>
      );
    }
    return null;
  }

  renderTitle(card, name, subname) {
    const factionColor = card.faction_code && FACTION_COLORS[card.faction_code];
    return (
      <View style={{
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: factionColor || '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: factionColor || '#000000',
      }}>
        <Text style={{
          marginLeft: 5,
          color: factionColor ? '#FFFFFF' : '#000000',
          fontSize: 18,
        }}>
          { `${card.is_unique ? '* ' : ''}${name}` }
        </Text>
        { subname && <Text style={{
          marginLeft: 15,
          color: factionColor ? '#FFFFFF' : '#000000',
          fontSize: 11,
        }}>{ subname }</Text> }
      </View>
    );
  }

  renderCardBack(card) {
    if (!card.double_sided) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={{
          width: '50%',
          marginTop: 2,
          borderColor: FACTION_COLORS[card.faction_code] || '#000000',
          borderWidth: 1,
          borderRadius: 3,
        }}>
          { this.renderTitle(card, card.back_name || card.name) }
          <View style={{ marginLeft: 5, marginTop: 5 }}>
            <Text style={styles.typeText}>
              { card.type_name }
            </Text>
            { !!card.back_text && (
              <View style={{
                marginTop: 3,
                marginLeft: 3,
                borderLeftWidth: 3,
                paddingLeft: 5,
                borderColor: FACTION_COLORS[card.faction_code] || '#000000'
              }}>
                <CardText text={card.back_text} />
              </View>
            )}
            { !!card.back_flavor && <Text style={styles.flavorText}>{ card.back_flavor }</Text>}
          </View>
        </View>
          { card.imagesrc &&
            <Image
              style={styles.cardImage}
              source={{
                uri: `https://arkhamdb.com${card.backimagesrc}`,
              }}
            />
          }
      </View>
    );
  }

  render() {
    const {
      card,
    } = this.props;
    return (
      <ScrollView>
        { this.renderCardBack(card) }
        <View style={styles.container}>
          <View style={{
            width: '50%',
            marginTop: 2,
            borderColor: FACTION_COLORS[card.faction_code] || '#000000',
            borderWidth: 1,
            borderRadius: 3,
          }}>
            { this.renderTitle(card, card.name, card.subname) }
            <View style={{ marginLeft: 5, marginTop: 5 }}>
              { this.renderMetadata(card) }
              { this.renderPlaydata(card) }
              { card.type_code === 'story' && <Text style={styles.flavorText}>{ card.flavor }</Text>}
              { !!card.real_text && (
                <View style={{
                  marginTop: 3,
                  marginLeft: 3,
                  borderLeftWidth: 3,
                  paddingLeft: 5,
                  borderColor: FACTION_COLORS[card.faction_code] || '#000000'
                }}>
                  <CardText text={card.real_text} />
                </View>
              )}
              { ('victory' in card && card.victory !== null) &&
                <Text style={styles.typeText}>{ `Victory: ${card.victory}.` }</Text>}
              { !!card.flavor && card.type_code !== 'story' && <Text style={styles.flavorText}>{ card.flavor }</Text>}
              { !!card.illustrator && <Text>{ card.illustrator }</Text> }
              { !!card.pack_name &&
                <Text>
                  { `${card.pack_name} #${card.position % 1000}.` }
                  { card.encounter_name ?
                    ` ${card.encounter_name} #${card.encounter_position}.` :
                    '' }
                </Text>
              }
            </View>
          </View>
          { card.imagesrc &&
            <Image
              style={styles.cardImage}
              source={{
                uri: `https://arkhamdb.com${card.imagesrc}`,
              }}
            /> }
        </View>
        { card.linked_card && <CardDetailView id={card.code} card={card.linked_card} /> }
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.id in state.cards.all) {
    return {
      card: state.cards.all[props.id],
    };
  }
  return {
    card: null,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(CardDetailView);

const styles = StyleSheet.create({
  typeText: {
    fontWeight: '700',
  },
  traitsText: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  flavorText: {
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  container: {
    margin: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  cardText: {
    width: '50%',
  },
  cardImage: {
    height: 250,
    width: '50%',
    resizeMode: 'contain',
  },
});