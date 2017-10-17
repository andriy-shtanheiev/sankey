import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation, HostListener } from '@angular/core';
import { D3Service, D3, Selection, EnterElement } from 'd3-ng2-service';

import * as d3Sankey from 'd3-sankey';

@Component({
  selector: 'sankey-diagram',
  templateUrl: './sankey-diagram.component.html',
  styleUrls: ['./sankey-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SankeyDiagramComponent implements OnInit, OnChanges {

  private _d3: D3;
  private _nativeElement;
  private _svg: Selection<Element | EnterElement | Window, d3Sankey.SankeyExtraProperties, null, undefined>;
  private _node: Selection<Element | EnterElement | Window, d3Sankey.SankeyExtraProperties, Element | EnterElement | Window, d3Sankey.SankeyExtraProperties>;
  private _link: Selection<Element | EnterElement | Window, d3Sankey.SankeyExtraProperties, Element | EnterElement | Window, d3Sankey.SankeyExtraProperties>;
  private _sankey: d3Sankey.SankeyLayout<d3Sankey.SankeyGraph<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>, d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>;
  @Input("data") _data: d3Sankey.SankeyGraph<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>;

  constructor(private _element: ElementRef, private _d3Service: D3Service) {
    this._d3 = _d3Service.getD3();
    this._nativeElement = _element.nativeElement;
    const rect = this._nativeElement.getBoundingClientRect();
    const width = rect.Width | 1024;
    const height = rect.Height | 768;
    this._svg = this._d3.select(this._nativeElement).append("svg").attr("width", width).attr("height", height);
  }

  private createGraph() {
    
    const d3: D3 = this._d3;
    const nativeElement = this._nativeElement;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const rect = nativeElement.getBoundingClientRect();

    const width = rect.Width | 1024;
    const height = rect.Height | 768;
    const calculatedWidth = width - margin.left - margin.right;
    const calculatedHeight = height - margin.top - margin.bottom;
    const nodeWidth = 15;
    const nodePadding = 10;
    const data = this._data;

    let svg = this._svg.attr("width", width).attr("height", height);
    svg.select("g.nodes").remove();
    svg.select("g.links").remove();

    let sankey = d3Sankey.sankey<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([[1, 1], [calculatedWidth, calculatedHeight]])
      .nodeId(function (d) { return d.id; })
      .size([width, height]);

    let link = svg.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("path");

    let node = svg.append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("g");

    this._sankey = sankey;
    this._svg = svg;
    this._node = node;
    this._link = link;
  }

  updateGraph(data: d3Sankey.SankeyGraph<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>) {
    this._sankey(data);

    const units = "";
    let node = this._node;
    let link = this._link;
    const nativeElement = this._nativeElement;
    const d3: D3 = this._d3;

    const rect = nativeElement.getBoundingClientRect();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = rect.Width | 1024;
    const height = rect.Height | 768;
    const calculatedWidth = width - margin.left - margin.right;
    const calculatedHeight = height - margin.top - margin.bottom;
    let formatNumber = d3.format(",.0f"),
    format = function (d) { return `${formatNumber(d)} ${units}`; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

    link = link
      .data(data.links)
      .enter()
      .append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", function (d) { return Math.max(1, d.width); });

    link.append("title")
      .text(function (d) { return d.source.name + " → " + d.target.name + "\n" + d3.format(d.value); });

    node = node
      .data(data.nodes)
      .enter()
      .append("g");

    node.append("rect")
      .attr("x", function (d) { return d.x0; })
      .attr("y", function (d) { return d.y0; })
      .attr("height", function (d) { return d.y1 - d.y0; })
      .attr("width", function (d) { return d.x1 - d.x0; })
      .attr("fill", function (d) { return color(d.name.replace(/ .*/, "")); })
      .attr("stroke", "#000");

    node.append("text")
      .attr("x", function (d) { return d.x0 - margin.left - margin.right; })
      .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function (d) { return d.name; })
      .filter(function (d) { return d.x0 < width / 2; })
      .attr("x", function (d) { return d.x1 + margin.left + margin.right; })
      .attr("text-anchor", "start");

    node.append("title")
      .text(function (d) { return d.name + "\n" + format(d.value); });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let dataChanges = changes["_data"];
    if (dataChanges) {
      if (dataChanges.isFirstChange()) {
        this.createGraph();
      }

      if (dataChanges.currentValue) {
        this.updateGraph(dataChanges.currentValue);
      }
    }
  }

  @HostListener('window.resize', ['$event.target'])
  onResize(event) {
    if (this._data) {
      this.createGraph();
      this.updateGraph(this._data);
    }
  }
}
