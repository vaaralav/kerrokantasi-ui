import React from 'react';
import Scroll from 'react-scroll';
import {Link} from 'react-router';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage, FormattedPlural} from 'react-intl';
import OverviewMap from '../../components/OverviewMap';
import SocialBar from '../../components/SocialBar';
import SubSectionListGroup from '../../components/SubSectionListGroup';
import formatRelativeTime from '../../utils/formatRelativeTime';
import Icon from '../../utils/Icon';
import {hasFullscreenMapPlugin, getHearingURL} from '../../utils/hearing';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Row from 'react-bootstrap/lib/Row';
import getAttr from '../../utils/getAttr';

const CustomGroupItem = ({Wrapper, className = '', children, ...rest}) =>
  <Wrapper className={`list-group-item ${className}`} {...rest}>
    {children}
  </Wrapper>;

CustomGroupItem.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.elements,
  Wrapper: React.PropTypes.element
};


class Sidebar extends React.Component {

  getCommentsTOCItem() {
    const {hearing, isHearingPage} = this.props;
    const fullscreen = hasFullscreenMapPlugin(hearing);
    const commentsURL = (
      fullscreen ? getHearingURL(hearing, {fullscreen: true}) : `${getHearingURL(hearing)}#hearing-comments`
    );
    if (this.props.mainSection.n_comments === 0) {
      return null;
    }

    const CommentsGroupItem = ({...rest}) =>
      <CustomGroupItem {...rest}>
        <FormattedMessage id={fullscreen ? "commentsOnMap" : "comments"}/>
        <div className="comment-icon">
          <Icon name="comment-o"/>&nbsp;{this.props.mainSection.n_comments}
        </div>
      </CustomGroupItem>;

    return (
      isHearingPage ?
        <CommentsGroupItem Wrapper={Scroll.Link} to="#hearing-comments" spy /> :
        <CommentsGroupItem Wrapper={Link} to={commentsURL}/>
    );
  }

  getHearingTOCItem() {
    const {hearing, isHearingPage} = this.props;
    const hearingURL = getHearingURL(hearing);

    const HearingGroupItem = ({...rest}) =>
      <CustomGroupItem {...rest}>
        <FormattedMessage id="hearing"/>
      </CustomGroupItem>;

    return (
      isHearingPage ?
        <HearingGroupItem Wrapper={Scroll.Link} to="#hearing" spy /> :
        <HearingGroupItem Wrapper={Link} to={hearingURL}/>
    );
  }

  render() {
    const {hearing, sectionGroups} = this.props;
    const {language} = this.context;
    const TOP_OFFSET = 75;
    const BOTTOM_OFFSET = 165;

    const boroughDiv = (hearing.borough ? (<div>
      <h4><FormattedMessage id="borough"/></h4>
      <Label>{hearing.borough}</Label>
    </div>) : null);
    const hearingMap = (hearing.geojson ? (<div className="sidebar-section map">
      <h4><FormattedMessage id="overview-map"/></h4>
      <OverviewMap hearings={[hearing]} style={{width: '100%', height: '200px'}} hideIfEmpty />
    </div>) : null);
    return (<Col md={4} lg={3}>
      <AutoAffix viewportOffsetTop={TOP_OFFSET} offsetBottom={BOTTOM_OFFSET} container={this.parentNode}>
        <div className="hearing-sidebar" style={{maxHeight: window.innerHeight - TOP_OFFSET - BOTTOM_OFFSET}}>
          <Row>
            <Col sm={6} md={12}>
              <div className="sidebar-section commentNumber">
                <Icon name="comment-o"/> {' '}
                <FormattedPlural
                  value={hearing.n_comments}
                  one={<FormattedMessage id="totalSubmittedComment" values={{n: hearing.n_comments}}/>}
                  other={<FormattedMessage id="totalSubmittedComments" values={{n: hearing.n_comments}}/>}
                />
              </div>
              <div className="sidebar-section timetable">
                <h4><FormattedMessage id="timetable"/></h4>
                <Icon name="clock-o"/> {formatRelativeTime("timeOpen", hearing.open_at)}<br/>
                <Icon name="clock-o"/> {formatRelativeTime("timeClose", hearing.close_at)}
              </div>
              <div className="sidebar-section contents">
                <h4><FormattedMessage id="table-of-content"/></h4>
                <ListGroup>
                  {this.getHearingTOCItem()}
                  {sectionGroups.map((sectionGroup) => (
                    <ListGroupItem href={sectionGroup.sections ? null : "#hearing-sectiongroup-" + sectionGroup.type} key={sectionGroup.type}>
                      {getAttr(sectionGroup.name_plural, language)}
                      <SubSectionListGroup hearingSlug={hearing.slug} sections={sectionGroup.sections}/>
                    </ListGroupItem>
                  ))}
                  {this.getCommentsTOCItem()}
                </ListGroup>
              </div>
            </Col>
            <Col sm={6} md={12}>
              {boroughDiv}
              <SocialBar />
              {hearingMap}
            </Col>
          </Row>
        </div>
      </AutoAffix>
    </Col>);
  }
}

Sidebar.propTypes = {
  hearing: React.PropTypes.object,
  isHearingPage: React.PropTypes.bool,
  mainSection: React.PropTypes.object,
  router: React.PropTypes.object,
  sectionGroups: React.PropTypes.array
};

Sidebar.defaultProps = {
  isHearingPage: false
};

Sidebar.contextTypes = {
  language: React.PropTypes.string.isRequired
};

export default injectIntl(Sidebar);
