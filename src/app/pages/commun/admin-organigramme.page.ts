import { Component, computed, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { OrganigrammeDumb } from '../dumbs/organigramme.dumb';
import { TreeNode } from 'primeng/api';
import { ContratUserApp } from '../../models/contrat-employe.model';

@Component({
  template: `
    <!-- <dumb-organigramme [data]="dataTreeNode()"></dumb-organigramme> -->
    <div class="d-flex">
      @for (data of []; track data) {
        <div class="border">
          <dumb-organigramme [data]="[data]"></dumb-organigramme>
        </div>
      }
    </div>
  `,
  animations: [],
  standalone: true,
  imports: [OrganigrammeDumb]
})
export class AdminOrganigrammePage implements OnInit {
  constructor(private server: ServerService) {}

  ngOnInit(): void {
    // this.server.getAllContrat();
  }

  // dataTreeNode = computed(() => {
  //   console.log(this.server.adminAllContratList());
  //   return this.transformToTree(this.server.adminAllContratList());
  // });

  // transformToTree(contratList: ContratUserApp[]): TreeNode[] {
  //   const contratMap: { [key: number]: TreeNode } = {};
  //   const roots: TreeNode[] = [];
  //   // Créer une map des utilisateurs sous forme de TreeNode
  //   contratList.forEach((contrat) => {
  //     contratMap[contrat.id] = {
  //       label: `${contrat.userApp.prenom} ${contrat.userApp.nom}`,
  //       data: contrat.poste,
  //       expanded: true,
  //       children: [],
  //       draggable: true,
  //       droppable: true
  //     };
  //   });

  //   // Parcourir la liste et construire l'arbre
  //   contratList.forEach((contrat) => {
  //     if (contrat.contratManager) {
  //       const contratManagerNode = contratMap[contrat.contratManager.id];
  //       if (contratManagerNode) {
  //         contratManagerNode.children!.push(contratMap[contrat.id]);
  //       }
  //     } else {
  //       roots.push(contratMap[contrat.id]); // Ajout des utilisateurs sans contratManager comme racine
  //     }
  //   });
  //   console.log();
  //   return roots;
  // }
}
