import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataSet, Network } from 'vis';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  nodes = new DataSet<any>([
    { id: 1, label: 'Lion' },
    { id: 2, label: 'Tiger' },
    { id: 3, label: 'Panther' },
    { id: 4, label: 'Leopard' },
    { id: 5, label: 'Cheetah' }
  ]);

  edges = new DataSet<any>([
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 4, to: 5 },
    { from: 5, to: 1 },
    { from: 3, to: 4 }
  ]);

  network: Network | undefined;
  searchText: string = '';
  selectedLabel: string = '';
  filteredLabels: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredLabels = this.nodes.get().map((node: any) => node.label);
  }

  ngAfterViewInit(): void {
    const container = document.getElementById('mynetwork');
    if (container) {
      const data = { nodes: this.nodes, edges: this.edges };
      const options = {
        layout: {
          improvedLayout: true
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09
          },
          stabilization: {
            iterations: 2500
          }
        },
        nodes: {
          shape: 'dot',
          size: 16
        }
      };
      this.network = new Network(container, data, options);
    } else {
      console.error('Elemento com id "mynetwork" não encontrado.');
    }
  }

  filterLabels(): void {
    if (this.searchText.trim() === '') {
      this.filteredLabels = this.nodes.get().map((node: any) => node.label);
    } else {
      const searchValue = this.searchText.toLowerCase();
      this.filteredLabels = this.nodes.get().map((node: any) => node.label.toLowerCase()).filter((label: string) => label.includes(searchValue));
    }
  }

  searchNode(): void {
    if (!this.network || this.selectedLabel === '') return;

    const foundNode = this.nodes.get().filter((node: any) => node.label.toLowerCase() === this.selectedLabel.toLowerCase());

    if (foundNode.length > 0) {
      const nodeId = foundNode[0].id;
      this.network.selectNodes([nodeId]);
      this.network.focus(nodeId, { scale: 1 });
    } else {
      console.log('Node não encontrado.');
    }
  }
}
