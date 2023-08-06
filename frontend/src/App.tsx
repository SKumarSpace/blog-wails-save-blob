import { useState } from "react";
import { SaveFile } from "../wailsjs/go/main/App";

export default function App() {
  const [isSaving, setIsSaving] = useState(false);

  const createCsvString = () => {
    const csvHeaders = "City, State";
    const csvRows = [
      ["New York City", "New York"],
      ["Los Angeles", "California"],
      ["Chicago", "Illinois"],
    ];
    const csvString = [csvHeaders, ...csvRows.map((row) => row.join(","))].join("\n");
    return csvString;
  };

  const blobToBase64 = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result;
        if (typeof base64data === "string") {
          resolve(base64data.split(",")[1]);
        }

        reject("Base64 data is not a string");
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    const csvString = createCsvString();
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    const base64 = await blobToBase64(blob);

    const title = "Save cities.csv";
    const filename = "cities.csv";
    const fileFilderDisplay = "Csv File (*.csv)";
    const fileExtension = "*.csv";
    await SaveFile(title, filename, fileFilderDisplay, fileExtension, base64);
    setIsSaving(false);
  };

  return (
    <div id="App">
      <button className="btn" onClick={handleSave}>
        {isSaving ? "Saving... please wait" : "Save CSV File Blob"}
      </button>
    </div>
  );
}
