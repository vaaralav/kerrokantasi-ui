import FullscreenHearing from '../../components/FullscreenHearing';
import DefaultHearingComponent from '../../components/Hearing';
import Helmet from 'react-helmet';
import LoadSpinner from '../../components/LoadSpinner';
import React from 'react';
import {connect} from 'react-redux';
import {fetchHearing} from '../../actions';
import {getMainSection, getHearingURL} from '../../utils/hearing';
import {injectIntl, intlShape} from 'react-intl';
import {push} from 'redux-router';
import getAttr from '../../utils/getAttr';


export class HearingView extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the HearingView view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return dispatch(fetchHearing(params.hearingSlug, location.query.preview));
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState, location, params) {
    const {state, data} = (getState().hearing[params.hearingSlug] || {state: 'initial'});
    return (state === 'done' && data);
  }

  componentDidMount() {
    const {dispatch, params, location} = this.props;
    HearingView.fetchData(dispatch, null, location, params);
  }

  getOpenGraphMetaData(data) {
    const {language} = this.props;
    let hostname = "http://kerrokantasi.hel.fi";
    if (typeof HOSTNAME === 'string') {
      hostname = HOSTNAME;  // eslint-disable-line no-undef
    } else if (typeof window !== 'undefined') {
      hostname = window.location.protocol + "//" + window.location.host;
    }
    const url = hostname + this.props.location.pathname;
    return [
      {property: "og:url", content: url},
      {property: "og:type", content: "website"},
      {property: "og:title", content: getAttr(data.title, language)}
      // TODO: Add description and image?
    ];
  }

  renderSpinner() {  // eslint-disable-line class-methods-use-this
    return (
      <div className="container">
        <LoadSpinner />
      </div>
    );
  }

  checkNeedForFullscreen(hearing) {
    const fullscreenParam = this.props.location.query.fullscreen;
    const requiresFullscreen = getMainSection(hearing).plugin_fullscreen;
    if (requiresFullscreen && fullscreenParam === undefined) {
      // Looks like we need fullscreen mode, but we aren't currently using it.
      // Let's redirect to proper hearing URL
      this.props.dispatch(push(getHearingURL(hearing)));
    }
    return fullscreenParam === "true";
  }

  render() {
    const {hearingSlug} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingSlug] || {state: 'initial'});
    const {user, language, dispatch} = this.props;

    if (state !== 'done') {
      return this.renderSpinner();
    }

    const fullscreen = this.checkNeedForFullscreen(hearing);
    const HearingComponent = fullscreen ? FullscreenHearing : DefaultHearingComponent;

    return (
      <div className={fullscreen ? "fullscreen-hearing" : "container"}>
        <Helmet title={getAttr(hearing.title, language)} meta={this.getOpenGraphMetaData(hearing)} />
        <HearingComponent
          hearingSlug={hearingSlug}
          hearing={hearing}
          user={user}
          sectionComments={this.props.sectionComments}
          location={this.props.location}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

HearingView.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  params: React.PropTypes.object,
  language: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object
};

export function wrapHearingView(view) {
  const wrappedView = connect((state) => ({
    user: state.user,
    hearing: state.hearing,
    language: state.language,
    sectionComments: state.sectionComments,
  }))(injectIntl(view));

  // We need to re-hoist the data statics to the wrapped component due to react-intl:
  wrappedView.canRenderFully = view.canRenderFully;
  wrappedView.fetchData = view.fetchData;
  return wrappedView;
}

export default wrapHearingView(HearingView);
