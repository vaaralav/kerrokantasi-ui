import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';
import {getSectionURL} from '../utils/section';

const SubSectionListGroup = ({hearingSlug, sections, language = 'fi'}) => (
  <ListGroup className="subsection-list-group">
    {sections && sections.map((section) =>
      <LinkContainer to={getSectionURL(hearingSlug, section)} key={section.id}>
        <ListGroupItem className="subsection-list-group-item">
          <span className="subsection-list-group-item__title">
            {getAttr(section.title, language)}
          </span>
          <div className="subsection-list-group-item__comments comment-icon">
            <Icon name="comment-o"/>&nbsp;{section.n_comments}
          </div>
        </ListGroupItem>
      </LinkContainer>
    )}
  </ListGroup>);

SubSectionListGroup.propTypes = {
  hearingSlug: PropTypes.string,
  language: PropTypes.string,
  sections: PropTypes.array,
};

SubSectionListGroup.contextTypes = {
  language: PropTypes.string
};

export default SubSectionListGroup;
