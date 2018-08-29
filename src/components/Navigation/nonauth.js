import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Account from "@material-ui/icons/AccountCircle";
import Person from "@material-ui/icons/PersonAdd";
import Drawer from "@material-ui/core/Drawer";
import Language from "@material-ui/icons/Language";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import RadioButtonChecked from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import { FormattedMessage, injectIntl } from "react-intl";
import * as routes from "../../constants/routes";
import * as actions from "../../constants/action_types";
//Language messages
import { EN } from "../../Languages/en";
import { ZH_TW } from "../../Languages/zh-TW";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
};

class NavigationNonAuth extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            languageOpen: false,
        };
    }

    toggleDrawer = (open) => () => {
        this.setState({ open });
    };

    toggleOption = (e, option) => {
        if (option === "language") {
            this.setState((state) => ({ languageOpen: !state.languageOpen }));
        }
    }

    redirect = (route) => {
        this.props.history.push(route);
    }

    render() {
        const { languageOpen } = this.state;
        const { classes, intl, language } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List><ListItem button onClick={() => this.redirect(routes.LOGIN)}><ListItemIcon><Account /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "sign_in.login" })} /></ListItem></List>
                <List><ListItem button onClick={() => this.redirect(routes.SIGN_UP)}><ListItemIcon><Person /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "sign_up.sign_up" })} /></ListItem></List>

                {/* Language Option */}
                <List><ListItem button onClick={(e) => this.toggleOption(e, "language")}><ListItemIcon><Language style={{ color: "#9b59b6" }} /></ListItemIcon><ListItemText primary={intl.formatMessage({ id: "nav.language" })} />{languageOpen ? <ExpandLess /> : <ExpandMore />}</ListItem></List>
                <Collapse in={languageOpen} timeout="auto" unmountOnExit>
                    {/* English */}
                    <List>
                        <ListItem button onClick={() => this.props.setLanguage("en", EN)}>
                            <ListItemIcon>
                                {language === "en"
                                    ? <RadioButtonChecked style={{ color: "#9b59b6" }} />
                                    : <RadioButtonUnchecked style={{ color: "#9b59b6" }} />
                                }
                            </ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "languages.en" })} />
                        </ListItem>
                    </List>

                    {/* Chinese (Traditional) */}
                    <List>
                        <ListItem button onClick={() => this.props.setLanguage("zh", ZH_TW)}>
                            <ListItemIcon>
                                {language === "zh"
                                    ? <RadioButtonChecked style={{ color: "#9b59b6" }} />
                                    : <RadioButtonUnchecked style={{ color: "#9b59b6" }} />
                                }
                            </ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "languages.zh" })} />
                        </ListItem>
                    </List>
                </Collapse>
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer open={this.state.open} onClose={this.toggleDrawer(false)}>
                            <div
                                tabIndex={0}
                                role="button"
                                onKeyDown={() => this.toggleDrawer(false)}
                            >
                                {sideList}
                            </div>
                        </Drawer>

                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <span style={{ color: "#3fb5a3" }}>
                                <FormattedMessage id="wallet_savior" />
                            </span>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.languageState.language
})

const mapDispatchToProps = (dispatch) => ({
    setLanguage: (language, messages) => dispatch({ type: actions.SET_LANGUAGE, language, messages })
})

export default compose(
    injectIntl,
    withRouter,
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
)(NavigationNonAuth);