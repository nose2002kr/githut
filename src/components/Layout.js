/**
 * Layout class that is used to compose all react
 * components into one app div
 * Provides dependency injection via props
 * Contains no logic and no functions except render
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { useReducer } from "react";
import { Route } from "react-router-dom"
import LangChart from "components/LangChart"
import LangTable from "components/LangTable"
import LicensePie from "components/LicensePie"
import Button from "components/Button"
import Head from "components/Head"
import Header from "components/Header"
import Content from "components/Content"
import Comments from "components/Comments"
import Footer from "components/Footer"
import Select from "components/Select"
import EventReducer from "reducers/EventReducer"
import TableReducer  from "reducers/TableReducer"
import HistReducer  from "reducers/HistReducer"
import pullRequests from "data/gh-pull-request.json"
import pushEvent from "data/gh-push-event.json"
import starEvent from "data/gh-star-event.json"
import issueEvent from "data/gh-issue-event.json"
import DownloadButton from "./DownloadButton";

class Config {
    constructor() {
        this.viewMode = process.env.REACT_APP_VIEW_MODE || "full"; // "full" or "minimal" or "compact"
        this.hideHeader = process.env.REACT_APP_HIDE_HEADER || false;
        this.hideContent = process.env.REACT_APP_HIDE_CONTENT || false;
        this.hideComments = process.env.REACT_APP_HIDE_COMMENTS || false;
        this.hideFooter = process.env.REACT_APP_HIDE_FOOTER || false;
        this.hideLicensePie = process.env.REACT_APP_HIDE_LICENSE_PIE || false;
        this.hideDownloadButton = process.env.REACT_APP_HIDE_DOWNLOAD_BUTTON || false;
        this.hideChartTable = process.env.REACT_APP_HIDE_CHART_TABLE || false;

        if (this.viewMode === "minimal") {
            this.hideHeader = true;
            this.hideContent = true;
            this.hideComments = true;
            this.hideFooter = true;
            this.hideLicensePie = true;
            this.hideDownloadButton = true;
            this.hideChartTable = true;
        } else if (this.viewMode === "compact") {
            this.hideHeader = true;
            this.hideContent = true;
            this.hideComments = true;
            this.hideFooter = true;
            this.hideLicensePie = true;
        }
    }
};

export default function Layout() {
    const config = new Config();

    const table = useReducer(TableReducer, {});
    const hist = useReducer(HistReducer, { year: "2018", quarter: "1" });
    const event = useReducer(EventReducer, {
        data: pullRequests,
        name: "Pull Requests",
        pullRequests,
        pushEvent,
        starEvent,
        issueEvent,
    });

    return (
        <div>
            <Head />
            {config.hideHeader ? null : <Header /> }
            <Route
                path="/:event?/:year?/:quarter?/:lang?"
                render={(route) => (
                    <div>
                        <LangChart
                            {...route}
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        <div className="rowCenterGap"> 
                            <Button {...route} store={event} title="pull_requests"/>
                            <Button {...route} store={event} title="stars"/>
                            <Button {...route} store={event} title="pushes"/>
                            <Button {...route} store={event} title="issues"/>
                        </div>
                        <div className="rowCenter">
                            <Select {...route} hist={hist} year="true" />
                            <Select {...route} hist={hist} />
                        </div>
                        <div className="rowCenter" style={config.hideChartTable ? {display:'none'} : {}}>
                        <LangTable
                            store={event}
                            hist={hist}
                            table={table}
                        />
                        </div>
                        {config.hideDownloadButton ? null : (
                        <div className="rowCenter">
                            <DownloadButton />
                        </div>)}
                    </div>
                )}
            />
            { config.hideLicensePie ? null : <LicensePie /> }
            { config.hideContent ? null : <Content /> }
            { config.hideComments ? null : <Comments /> }
            { config.hideFooter ? null : <Footer /> }
        </div>
    )
}
