import { Component } from "@angular/core";

@Component({
  selector: "app-paid-search-summary",
  templateUrl: "./paid-search-summary.component.html",
  styleUrl: "./paid-search-summary.component.css",
})
export class PaidSearchSummaryComponent {
  isConditionTrue: boolean = true;
  violetHeader = false;
  evenRowVioletColor: boolean = true;
  oddRowVioletColor: boolean = true;
  headers = ["", " ", " ", " "];
  data = [
    {
      "Paid Search": "Creative 1",
      Impressions: "",
      Clicks: "",
      CTR: "23%",
    },
    {
      "Paid Search": "Creative 1",
      Impressions: "",
      Clicks: "",
      CTR: "23%",
    },
    {
      "Paid Search": "Creative 1",
      Impressions: "",
      Clicks: "",
      CTR: "23%",
    },
    {
      "Paid Search": "Creative 1",
      Impressions: "",
      Clicks: "",
      CTR: "23%",
    },
  ];
}
