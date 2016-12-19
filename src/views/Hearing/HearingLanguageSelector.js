import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

const QUESTIONNAIRE_LABELS = {
  fi: 'Kysely suomeksi',
  sv: 'Frågorna på svenska',
  en: 'Questionnaire in English'
};

const HearingLanguageSelector = ({onSelect, activeLanguage}) =>
  <ListGroup className="hearing-language-selector">
    {Object.keys(QUESTIONNAIRE_LABELS).map((key) =>
      <ListGroupItem key={key} onClick={() => onSelect(key)}>
        {QUESTIONNAIRE_LABELS[key]}{activeLanguage === key ? '!' : ''}
      </ListGroupItem>)}
  </ListGroup>;

HearingLanguageSelector.propTypes = {
  activeLanguage: PropTypes.string,
  hearing: PropTypes.object,
  onSelect: PropTypes.func,
};

export default HearingLanguageSelector;
