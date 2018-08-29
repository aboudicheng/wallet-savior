import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

function mapStateToProps(state) {
    const { language, messages } = state.languageState;
    return { locale: language, key: language, messages };
}

export default connect(mapStateToProps)(IntlProvider);