import { validateImage, readImageAsBase64, formatError } from './utils.js';

/**
 * 发票识别类
 */
export class InvoiceRecognition {
    constructor(config) {
        this.config = config;
        this.validateConfig();
    }

    /**
     * 验证配置
     */
    validateConfig() {
        if (!this.config.ocrApiUrl) {
            throw new Error('未配置OCR服务地址');
        }
        if (!this.config.apiKey) {
            throw new Error('未配置API密钥');
        }
    }

    /**
     * 识别发票
     * @param {File} file - 发票图片文件
     * @returns {Promise<Object>}
     */
    async recognize(file) {
        try {
            // 验证图片
            validateImage(file);

            // 转换为base64
            const base64Image = await readImageAsBase64(file);

            // 调用OCR服务
            const result = await this.callOcrService(base64Image);

            // 处理识别结果
            return this.processResult(result);
        } catch (error) {
            throw new Error(formatError(error));
        }
    }

    /**
     * 调用OCR服务
     * @param {string} base64Image - base64编码的图片
     * @returns {Promise<Object>}
     */
    async callOcrService(base64Image) {
        const response = await fetch(this.config.ocrApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                image: base64Image.split(',')[1], // 移除data:image/jpeg;base64,
                options: {
                    language: 'zh-CN',
                    type: 'invoice'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`OCR服务错误: ${response.status}`);
        }

        return response.json();
    }

    /**
     * 处理识别结果
     * @param {Object} result - OCR返回的原始结果
     * @returns {Object}
     */
    processResult(result) {
        // 这里的处理逻辑需要根据实际使用的OCR服务返回格式调整
        const processed = {};

        // 示例处理逻辑
        if (result.code === 0 && result.data) {
            const data = result.data;

            // 处理发票基本信息
            processed['发票代码'] = data.invoice_code;
            processed['发票号码'] = data.invoice_number;
            processed['开票日期'] = data.invoice_date;
            
            // 处理金额信息
            processed['金额'] = data.amount;
            processed['税额'] = data.tax_amount;
            processed['价税合计'] = data.total_amount;
            
            // 处理购销方信息
            processed['销售方名称'] = data.seller_name;
            processed['销售方税号'] = data.seller_tax_id;
            processed['购买方名称'] = data.buyer_name;
            processed['购买方税号'] = data.buyer_tax_id;
        } else {
            throw new Error(result.message || '识别失败');
        }

        return processed;
    }

    /**
     * 验证识别结果
     * @param {Object} result - 处理后的识别结果
     * @returns {boolean}
     */
    validateResult(result) {
        const requiredFields = [
            '发票代码',
            '发票号码',
            '开票日期',
            '金额'
        ];

        return requiredFields.every(field => {
            const value = result[field];
            return value !== undefined && value !== null && value !== '';
        });
    }

    /**
     * 格式化识别结果
     * @param {Object} result - 识别结果
     * @returns {Object}
     */
    formatResult(result) {
        const formatted = { ...result };

        // 格式化金额
        ['金额', '税额', '价税合计'].forEach(field => {
            if (formatted[field]) {
                formatted[field] = parseFloat(formatted[field]).toFixed(2);
            }
        });

        // 格式化日期
        if (formatted['开票日期']) {
            const date = new Date(formatted['开票日期']);
            formatted['开票日期'] = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        return formatted;
    }
} 