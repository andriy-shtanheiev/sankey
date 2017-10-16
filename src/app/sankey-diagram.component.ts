import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation, HostListener } from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';

import * as d3Sankey from 'd3-sankey';

@Component({
  selector: 'sankey-diagram',
  templateUrl: './sankey-diagram.component.html',
  styleUrls: ['./sankey-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SankeyDiagramComponent implements OnInit, OnChanges {

  private _d3: D3;
  private _nativeElement;
  private _svg;
  @Input("data") _data: { "nodes": [{ "name": string }], "links": [{ "source": number | string, "target": number | string, "value": number, "width": number }] };

  constructor(private _element: ElementRef, private _d3Service: D3Service) {
    this._d3 = _d3Service.getD3();
    this._nativeElement = _element.nativeElement;
  }

  private createGraph() {
    const units = "Widgets";
    const d3: D3 = this._d3;
    const nativeElement = this._nativeElement;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = nativeElement.offsetWidth | 1024 - margin.left - margin.right;
    const height = nativeElement.offsetHeight | 768 - margin.top - margin.bottom;
    const nodeWidth = 15;
    const nodePadding = 10;
    const layout = 32;
    const data = this._data;

    // format variables
    let formatNumber = d3.format(",.0f"),    // zero decimal places
      format = function (d) { return formatNumber(d) + " " + units; },
      color = d3.scaleOrdinal(d3.schemeCategory20);

    let svg = d3.select(nativeElement)
      .append("svg")
      .attr("width", nativeElement.offsetWidth | 1024)
      .attr("height", nativeElement.offsetHeight | 768)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);



    var sankey = d3Sankey.sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .size([width, height]);

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("path")
      .data(data.links)
      .enter()
      .append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", function (d) { return d.width; });

    this._svg = svg;
  }

  ngOnInit() {
    if (this._data)
      this.createGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._data) {
      this.createGraph();
    }
  }

  @HostListener('resize', ['$event'])
  onResize(event) {
    console.log(event.detail);
    if (this._data) {
      this.createGraph();
    }
  }
}
