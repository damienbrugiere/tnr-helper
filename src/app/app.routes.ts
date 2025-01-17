import { Routes } from "@angular/router";
import { ImportComponent } from "./import/import.component";
import { HomeComponent } from "./home/home.component";
import { IssueTemplateComponent } from "./issue-template/issue-template.component";
import { IssuesComponent } from "./issues/issues.component";
import { ConfigComponent } from "./config/config.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "settings",
        component: ConfigComponent
    },
    {
        path:"settings/issues",
        component: IssuesComponent
    },
    {
        path:"settings/issue/:id",
        component: IssueTemplateComponent
    },
    {
        path: "campaign/:id",
        component: ImportComponent
    }
];
