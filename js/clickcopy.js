(function () {
    'use strict';
    if (!navigator.clipboard) {
        return;
    }

    function createSVGIcon(iconName) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 32 32");

        const path = document.createElementNS(svgNS, "path");
        if (iconName === "copy") {
            path.setAttribute("d", "M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z");
            const path2 = document.createElementNS(svgNS, "path");
            path2.setAttribute("d", "M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z");
            svg.appendChild(path2);
        } else if (iconName === "checkmark") {
            path.setAttribute("d", "M13 24L4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z");
        }
        svg.appendChild(path);
        return svg;
    }

    function flashCopyMessage(el, msg, iconName) {
        var iconContainer = el.querySelector('.copy-icon');
        var msgContainer = el.querySelector('.copy-msg');

        // 更新图标
        iconContainer.innerHTML = '';
        iconContainer.appendChild(createSVGIcon(iconName));

        // 更新消息
        msgContainer.textContent = msg;

        setTimeout(function () {
            // 2秒后清除消息文本和图标变化
            msgContainer.textContent = '';
            iconContainer.innerHTML = '';
            iconContainer.appendChild(createSVGIcon('copy'));
        }, 2000);
    }

    function addCopyButton(containerEl) {
        if (containerEl.querySelector('.highlight-copy-btn')) {
            return;
        }

        var copyBtn = document.createElement("button");
        copyBtn.className = "highlight-copy-btn";
        copyBtn.setAttribute("aria-label", "Copy to clipboard");
        copyBtn.innerHTML = '<span class="copy-icon"></span><span class="copy-msg"></span>';
        copyBtn.querySelector('.copy-icon').appendChild(createSVGIcon('copy'));
        copyBtn.style.display = "none";

        var codeEl = containerEl.querySelector('code') || containerEl;
        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(codeEl.innerText).then(function () {
                flashCopyMessage(copyBtn, 'Copied!', 'checkmark');
            }, function (err) {
                console.error('Unable to copy: ', err);
                flashCopyMessage(copyBtn, 'Failed :\'(', 'copy');
            });
        });

        containerEl.appendChild(copyBtn);
        containerEl.style.position = 'relative';

        containerEl.addEventListener('mouseenter', function () {
            copyBtn.style.display = "block";
        });
        containerEl.addEventListener('mouseleave', function () {
            copyBtn.style.display = "none";
        });
    }

    // 添加复制按钮到所有代码块
    var codeBlocks = document.querySelectorAll('pre');
    Array.prototype.forEach.call(codeBlocks, addCopyButton);
})();