$output.webapp("app/app.component.ts")##
import { Component,OnInit } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import {Message,Growl, Menubar, MenuItem} from 'primeng/primeng';
import { HomeComponent } from './home.component';
import { MessageService } from './service/message.service';

#foreach($entity in $project.withoutManyToManyJoinEntities.list)
import { ${entity.service.type} } from './entities/${entity.model.var}/${entity.model.var}.service';
import { ${entity.model.type}Component } from './entities/${entity.model.var}/${entity.model.var}.component';
#end

@Component({
    selector: 'my-app',
    template: `<p-growl [value]="msgs"></p-growl>
               <p-menubar [model]="items"></p-menubar>
               <router-outlet>
               </router-outlet>`,
    directives: [ROUTER_DIRECTIVES, Menubar, Growl],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        MessageService,
#foreach($entity in $project.withoutManyToManyJoinEntities.list)
        ${entity.service.type}#if($velocityHasNext),
#else

    ]
#end
#end
})
@Routes([
    { path : '/',  component: HomeComponent }#if($project.withoutManyToManyJoinEntities.size > 0),
#end
#foreach($entity in $project.withoutManyToManyJoinEntities.list)
    { path: '/${entity.model.var}', component: ${entity.model.type}Component }#if($velocityHasNext),
#else

    ])
#end
#end
export class AppComponent implements OnInit {
    private items : MenuItem[] = [{label: 'hello'}];

    msgs : Message[] = [];

    constructor(private messageService: MessageService) {
        messageService.messageSource${dollar}.subscribe(
            msg => {
                this.msgs.push(msg);
            });
    }

    ngOnInit() {
        this.items = [
            { label: 'Entities', icon: 'fa-binoculars', items: [
#foreach($entity in $project.withoutManyToManyJoinEntities.list)
                {label: '${entity.model.type} List', routerLink: ['/${entity.model.var}']}#if($velocityHasNext),
#end
#end
                ]
            },
            { label: 'Swagger', url : "/swagger-ui.html", icon: 'fa-gear' },
            { label: 'Documentation',
                icon: 'fa-book',
                items: [
                    {label: "Source code on github for this project", icon: 'fa-github-alt', url:"https://github.com/jaxio/celerio-angular-quickstart"},
                    {label: "Celerio Documentation", icon: 'fa-external-link', url:"http://www.jaxio.com/documentation/celerio/"},
                    {label: "PrimeNG Showcase", icon: 'fa-external-link', url:"http://www.primefaces.org/primeng"},
                    {label: "Angular JS 2", icon: 'fa-external-link', url:"http://angular.io/"},
                    {label: "Spring Boot", icon: 'fa-external-link', url:"http://projects.spring.io/spring-boot/"},
                    {label: "Spring Data JPA", icon: 'fa-external-link', url:"http://projects.spring.io/spring-data-jpa/"},
                    {label: "TypeScript", icon: 'fa-external-link', url:"https://www.typescriptlang.org/"}
                ]
            }
        ];
    }
}
