import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

function mapStateToProps(state) {
    const { language, messages } = state.languageState;
    console.log(language)
    console.log(messages)
    return { locale: language, messages };
}

export default connect(mapStateToProps)(IntlProvider);