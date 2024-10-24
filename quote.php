<?php
include_once 'db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QIP Quote Builder</title>
    <link rel="shortcut icon" href="/images/favicon2.ico" type="image/x-icon" />
    <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.0/skin-win8/ui.fancytree.min.css"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
    <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
    <link rel="preload" href="/assets/css/quote.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript>
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.0/skin-win8/ui.fancytree.min.css" />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/quote.css" />
    </noscript>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.0/jquery.fancytree-all-deps.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" defer></script>
    <script src="/assets/js/quote.js" defer></script>
    <script src="/assets/js/download.js" defer></script>
    <script src="/assets/js/send.js" defer></script>
</head>

<body>
    <div id="main">
        <header>
            <span>QIP Quote Builder</span><button
                id="goHome"
                class="button"
                onclick="window.location.href='index.html'">
                Home
            </button>

        </header>
        <div id="sub-header">
            <div class="sub-header-quote">
                <button id="viewQuoteList" class="button">View Quote</button><button id="closeQuoteList" class="button">Close Quote</button><button id="download" class="button">Download</button>
            </div>
            <div
                class="sub-header-product"
                style="
            font-weight: bold;
            color: blue;
            font-size: 12pt;
            text-shadow: 1px 1px 2px black;
            margin-right: 0.5em;
            animation: pulse 3s infinite ease-in-out;
          ">
                more products coming soon...
            </div>
            <style>
                @keyframes pulse {
                    0% {
                        color: white;
                        transform: scale(1);
                    }

                    50% {
                        color: rgb(187, 255, 0);
                        transform: scale(1.075);
                    }

                    100% {
                        color: white;
                        transform: scale(1);
                    }
                }
            </style>
        </div>
        <div id="quoteListSection" style="display: none">
            <div id="quote-header">
                <form id="cust-form" class="cust-form">
                    <div class="cust-data">
                        <div class="basic">
                            <input
                                type="text"
                                id="company"
                                name="Company"
                                value=""
                                placeholder="Company" /><input
                                type="text"
                                id="name"
                                name="Name"
                                value=""
                                placeholder="Name" /><input
                                type="email"
                                id="email"
                                name="Email"
                                value=""
                                placeholder="Email" /><input
                                type="text"
                                id="phone"
                                name="Phone"
                                value=""
                                placeholder="Phone" />
                        </div>
                        <div class="notes">
                            <textarea
                                id="notes"
                                name="Notes"
                                rows="5"
                                cols="35"
                                placeholder="Notes"></textarea>
                        </div>
                    </div>
                    <button type="submit" id="send" class="button">Send</button>
                </form>
                <div id="quote-totals">
                    <div class="totals-container">
                        <div>
                            <span class="quote-total">Total Line Items: </span><span id="totalItems">0</span>
                        </div>
                        <div>
                            <span class="quote-total">Total Quantity: </span><span id="totalQty">0</span><span></span>
                        </div>
                        <div>
                            <span class="quote-total">Total Weight: </span><span id="totalWeight">0</span><span> lbs</span>
                        </div>
                    </div>
                    <div>
                        <button id="clearQuoteTable" class="button">Clear Quote</button>
                    </div>
                </div>
            </div>
            <div id="quote-table-container">
                <div id="quote-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Line#</th>
                                <th>Item-Code</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Weight</th>
                                <th style="color: #8f1a1a; font-weight: bold">X</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="spinner">
            <div class="spinner"></div>
            <div class="spinner-text">Sending...</div>
        </div>
        <div id="item-section">
            <div id="cat-tree-container">
                <div id="cat-tree"></div>
            </div>
            <div id="item-table">
                <table>
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Description</th>
                            <th>Case</th>
                            <th>Box</th>
                            <th>Each</th>
                            <th>Lbs / Ea</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</body>

</html>
<?php
