document.addEventListener('DOMContentLoaded', () => {
    const createFileButton = document.getElementById('createFile');
    const writeFileButton = document.getElementById('writeFile');
    const readFileButton = document.getElementById('readFile');
    const deleteFileButton = document.getElementById('deleteFile');

    const fileName = 'test.txt';
    const fileContent = 'Hello, OPFS!';

    createFileButton.addEventListener('click', async () => {
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(fileName, { create: true });
            console.log(`File "${fileName}" created.`);
            alert(`File "${fileName}" created.`);
        } catch (error) {
            console.error(error);
            alert(`Error creating file: ${error.message}`);
        }
    });

    writeFileButton.addEventListener('click', async () => {
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(fileName, { create: false });
            const writable = await fileHandle.createWritable();
            await writable.write(fileContent);
            await writable.close();
            console.log(`Wrote "${fileContent}" to "${fileName}".`);
            alert(`Wrote "${fileContent}" to "${fileName}".`);
        } catch (error) {
            console.error(error);
            alert(`Error writing to file: ${error.message}`);
        }
    });

    readFileButton.addEventListener('click', async () => {
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(fileName, { create: false });
            const file = await fileHandle.getFile();
            const content = await file.text();
            console.log(`Read from "${fileName}": "${content}".`);
            document.getElementById('fileContentDisplay').textContent = content;
            alert(`Read from "${fileName}" and displayed in preview area.`);
        } catch (error) {
            console.error(error);
            alert(`Error reading from file: ${error.message}`);
        }
    });

    deleteFileButton.addEventListener('click', async () => {
        try {
            const root = await navigator.storage.getDirectory();
            await root.removeEntry(fileName);
            console.log(`File "${fileName}" deleted.`);
            alert(`File "${fileName}" deleted.`);
        } catch (error) {
            console.error(error);
            alert(`Error deleting file: ${error.message}`);
        }
    });

    const writeLargeFileButton = document.getElementById('writeLargeFile');
    const readLargeFileButton = document.getElementById('readLargeFile');
    const fileSizeInput = document.getElementById('fileSize');
    const fileContentDisplay = document.getElementById('fileContentDisplay');

    writeLargeFileButton.addEventListener('click', async () => {
        const fileSizeMB = parseInt(fileSizeInput.value, 10);
        if (isNaN(fileSizeMB) || fileSizeMB <= 0) {
            alert('Please enter a valid file size in MB.');
            return;
        }

        const largeFileName = 'large_file.txt';
        const fileSize = fileSizeMB * 1024 * 1024;

        alert(`Writing a large file of ${fileSizeMB}MB. This may take some time.`);

        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(largeFileName, { create: true });
            const writable = await fileHandle.createWritable();

            // Generate dummy data
            const chunkSize = 1024 * 1024; // 1MB
            const charToRepeat = 'abcdefghijklmnopqrstuvwxyz0123456789'.repeat(Math.ceil(chunkSize / 36)); // To make the chunk 1MB
            const chunk = charToRepeat.substring(0, chunkSize);
            let writtenSize = 0;

            while (writtenSize < fileSize) {
                const remainingSize = fileSize - writtenSize;
                const sizeToWrite = Math.min(chunkSize, remainingSize);
                await writable.write(chunk.substring(0, sizeToWrite));
                writtenSize += sizeToWrite;
            }

            await writable.close();
            console.log(`Wrote ${fileSizeMB}MB to "${largeFileName}".`);
            alert(`Successfully wrote ${fileSizeMB}MB to "${largeFileName}".`);
        } catch (error) {
            console.error(error);
            alert(`Error writing large file: ${error.message}`);
        }
    });

    readLargeFileButton.addEventListener('click', async () => {
        const largeFileName = 'large_file.txt';
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(largeFileName, { create: false });
            const file = await fileHandle.getFile();

            if (file.size > (10 * 1024 * 1024)) { // Warn if file is larger than 10MB
                const confirmRead = confirm(`The file "${largeFileName}" is very large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Reading it might freeze your browser. Do you want to proceed?`);
                if (!confirmRead) {
                    alert('Read operation cancelled.');
                    return;
                }
            }

            alert(`Reading "${largeFileName}". This may take some time.`);
            const content = await file.text();
            fileContentDisplay.textContent = content;
            console.log(`Read from "${largeFileName}" and displayed in preview area.`);
            alert(`Successfully read "${largeFileName}" and displayed in preview area.`);
        } catch (error) {
            console.error(error);
            alert(`Error reading large file: ${error.message}`);
        }
    });

    // Generic File Operations
    const genericFileNameInput = document.getElementById('genericFileName');
    const genericFileContentTextarea = document.getElementById('genericFileContent');
    const loadGenericFileButton = document.getElementById('loadGenericFile');
    const createGenericFileButton = document.getElementById('createGenericFile');
    const deleteGenericFileButton = document.getElementById('deleteGenericFile');
    const saveGenericFileButton = document.getElementById('saveGenericFile');

    async function getFileHandle(fileName, create = false) {
        if (!fileName) {
            alert('Please enter a file name.');
            throw new Error('File name not provided.');
        }
        const root = await navigator.storage.getDirectory();
        return root.getFileHandle(fileName, { create });
    }

    loadGenericFileButton.addEventListener('click', async () => {
        const fileName = genericFileNameInput.value;
        try {
            const fileHandle = await getFileHandle(fileName, false);
            const file = await fileHandle.getFile();
            const content = await file.text();
            genericFileContentTextarea.value = content;
            alert(`File "${fileName}" loaded.`);
        } catch (error) {
            console.error(error);
            alert(`Error loading file: ${error.message}`);
        }
    });

    createGenericFileButton.addEventListener('click', async () => {
        const fileName = genericFileNameInput.value;
        try {
            await getFileHandle(fileName, true);
            alert(`File "${fileName}" created.`);
        } catch (error) {
            console.error(error);
            alert(`Error creating file: ${error.message}`);
        }
    });

    deleteGenericFileButton.addEventListener('click', async () => {
        const fileName = genericFileNameInput.value;
        try {
            const root = await navigator.storage.getDirectory();
            await root.removeEntry(fileName);
            alert(`File "${fileName}" deleted.`);
            genericFileContentTextarea.value = ''; // Clear content area after deletion
        } catch (error) {
            console.error(error);
            alert(`Error deleting file: ${error.message}`);
        }
    });

    saveGenericFileButton.addEventListener('click', async () => {
        const fileName = genericFileNameInput.value;
        const content = genericFileContentTextarea.value;
        try {
            const fileHandle = await getFileHandle(fileName, true); // create: true will create if not exists
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            alert(`File "${fileName}" saved.`);
        } catch (error) {
            console.error(error);
            alert(`Error saving file: ${error.message}`);
        }
    });

    // Master Data Generation
    const masterDataRowsInput = document.getElementById('masterDataRows');
    const generateMasterDataButton = document.getElementById('generateMasterData');

    function generateProductMasterRow(index) {
        const productCode = `P${String(index).padStart(8, '0')}`;
        const productName = `Product Name ${index}`;
        const price = Math.floor(Math.random() * 10000) + 100;
        return `${productCode},"${productName}",${price}\n`;
    }

    generateMasterDataButton.addEventListener('click', async () => {
        const numRows = parseInt(masterDataRowsInput.value, 10);
        if (isNaN(numRows) || numRows <= 0) {
            alert('Please enter a valid number of rows.');
            return;
        }

        const masterFileName = 'product_master.csv';
        alert(`Generating and writing ${numRows} rows of master data to "${masterFileName}".\nThis might take a while and freeze your browser. Please check the console for progress.`);
        console.log(`Starting master data generation for ${numRows} rows.`);

        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(masterFileName, { create: true });
            const writable = await fileHandle.createWritable();

            // Write header
            await writable.write('Product Code,Product Name,Price\n');

            // Write rows in chunks to avoid blocking the main thread for too long
            const chunkSize = 10000;
            for (let i = 0; i < numRows; i += chunkSize) {
                let chunkContent = '';
                const end = Math.min(i + chunkSize, numRows);
                for (let j = i; j < end; j++) {
                    chunkContent += generateProductMasterRow(j + 1);
                }
                await writable.write(chunkContent);
                console.log(`Wrote rows ${i + 1} to ${end}`);
                // Give the browser a moment to breathe
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            await writable.close();
            console.log(`Finished generating master data.`);
            alert(`Successfully wrote ${numRows} rows to "${masterFileName}".\nYou can now load this file using the "Generic File Operations" section.`);

        } catch (error) {
            console.error(error);
            alert(`Error generating master data: ${error.message}`);
        }
    });

    // Search Product
    const productCodeSearchInput = document.getElementById('productCodeSearch');
    const searchProductButton = document.getElementById('searchProductButton');
    const searchResultSpan = document.getElementById('searchResult');

    async function* makeTextFileLineIterator(fileURL) {
        const utf8Decoder = new TextDecoder("utf-8");
        const response = await fetch(fileURL);
        const reader = response.body.getReader();
        let { value: chunk, done: readerDone } = await reader.read();
        chunk = chunk ? utf8Decoder.decode(chunk) : "";

        const re = /\n|\r|\r\n/gm;
        let startIndex = 0;
        let result;

        for (;;) {
            let result = re.exec(chunk);
            if (!result) {
                if (readerDone) {
                    break;
                }
                let remainder = chunk.substr(startIndex);
                ({ value: chunk, done: readerDone } = await reader.read());
                chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
                startIndex = re.lastIndex = 0;
                continue;
            }
            yield chunk.substring(startIndex, result.index);
            startIndex = re.lastIndex;
        }
        if (startIndex < chunk.length) {
            // last line
            yield chunk.substr(startIndex);
        }
    }


    searchProductButton.addEventListener('click', async () => {
        const productCodeToSearch = productCodeSearchInput.value.trim();
        if (!productCodeToSearch) {
            alert('Please enter a product code to search.');
            return;
        }

        const masterFileName = 'product_master.csv';
        searchResultSpan.textContent = 'Searching...';
        
        try {
            const root = await navigator.storage.getDirectory();
            const fileHandle = await root.getFileHandle(masterFileName, { create: false });
            const file = await fileHandle.getFile();

            let found = false;

            // This approach is more memory-efficient than reading the whole file at once
            // however, it can still be slow for very large files in the main thread.
            // For a real-world application, a Web Worker would be better.
            const fileStream = file.stream();
            const reader = fileStream.pipeThrough(new TextDecoderStream()).pipeThrough(new TransformStream({
                transform(chunk, controller) {
                    let lines = (this.previous || '') + chunk;
                    let lastNewline = lines.lastIndexOf('\n');
                    this.previous = lines.slice(lastNewline + 1);
                    lines = lines.slice(0, lastNewline);
                    lines.split('\n').forEach(line => controller.enqueue(line));
                }
            }));

            const streamReader = reader.getReader();

            while (true) {
                const { done, value: line } = await streamReader.read();
                if (done) break;

                const columns = line.split(',');
                if (columns[0] && columns[0].trim() === productCodeToSearch) {
                    const productName = columns[1] ? columns[1].trim().replace(/"/g, '') : 'N/A';
                    searchResultSpan.textContent = productName;
                    found = true;
                    streamReader.cancel(); // Stop reading once found
                    break;
                }
            }


            if (!found) {
                searchResultSpan.textContent = 'Product not found.';
            }

        } catch (error) {
            console.error(error);
            searchResultSpan.textContent = `Error: ${error.message}`;
            if (error.name === 'NotFoundError') {
                 searchResultSpan.textContent = `Error: The file "${masterFileName}" does not exist. Please generate it first.`;
            }
        }
    });
});
