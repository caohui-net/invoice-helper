// ==UserScript==
// @name         发票识别助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动识别网页中的发票图片并提取信息
// @author       caohui-net
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@v2.1.0/dist/tesseract.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        // OCR引擎配置
        ocr: {
            lang: 'chi_sim', // 简体中文
            workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v2.1.0/dist/worker.min.js',
            corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v2.1.0/dist/tesseract-core.wasm.js'
        },
        // 通知配置
        notification: {
            title: '发票识别助手',
            timeout: 5000
        }
    };

    // 初始化OCR引擎
    let worker = null;
    async function initOCR() {
        try {
            worker = await Tesseract.createWorker({
                langPath: config.ocr.lang,
                workerPath: config.ocr.workerPath,
                corePath: config.ocr.corePath
            });
            console.log('OCR引擎初始化成功');
        } catch (error) {
            console.error('OCR引擎初始化失败:', error);
            GM_notification({
                title: config.notification.title,
                text: 'OCR引擎初始化失败，请刷新页面重试',
                timeout: config.notification.timeout
            });
        }
    }

    // 识别图片中的文字
    async function recognizeImage(image) {
        if (!worker) {
            await initOCR();
        }
        try {
            const result = await worker.recognize(image);
            return result.data.text;
        } catch (error) {
            console.error('图片识别失败:', error);
            return null;
        }
    }

    // 提取发票信息
    function extractInvoiceInfo(text) {
        // 这里可以根据实际发票格式编写正则表达式来提取信息
        const patterns = {
            invoiceCode: /发票代码[:：]\s*(\d+)/,
            invoiceNumber: /发票号码[:：]\s*(\d+)/,
            amount: /金额[:：]\s*(\d+\.\d+)/,
            date: /日期[:：]\s*(\d{4}[-年]\d{1,2}[-月]\d{1,2}[日]?)/
        };

        const info = {};
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                info[key] = match[1];
            }
        }
        return info;
    }

    // 处理图片元素
    async function handleImage(img) {
        const text = await recognizeImage(img);
        if (text) {
            const info = extractInvoiceInfo(text);
            if (Object.keys(info).length > 0) {
                GM_notification({
                    title: config.notification.title,
                    text: `识别到发票信息：\n${JSON.stringify(info, null, 2)}`,
                    timeout: config.notification.timeout
                });
            }
        }
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IMG') {
                    handleImage(node);
                }
            });
        });
    });

    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    initOCR();
})(); 