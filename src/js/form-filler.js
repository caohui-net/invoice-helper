import { highlightElement, scrollToElement, formatDate, formatAmount } from './utils.js';

/**
 * 表单填充器类
 */
export class FormFiller {
    constructor(fieldMapping) {
        this.fieldMapping = fieldMapping;
    }

    /**
     * 填充表单字段
     * @param {Object} recognitionResult - OCR识别结果
     */
    fillForm(recognitionResult) {
        Object.entries(this.fieldMapping).forEach(([fieldId, ocrField]) => {
            if (recognitionResult[ocrField]) {
                this.fillField(fieldId, recognitionResult[ocrField]);
            }
        });
    }

    /**
     * 填充单个字段
     * @param {string} fieldId - 字段ID
     * @param {string} value - 字段值
     */
    fillField(fieldId, value) {
        const input = this.findInput(fieldId);
        if (!input) {
            console.warn(`未找到字段: ${fieldId}`);
            return;
        }

        // 根据字段类型处理值
        const formattedValue = this.formatValue(input, value);
        
        // 设置值
        input.value = formattedValue;
        
        // 触发事件
        this.triggerEvents(input);
        
        // 高亮显示
        highlightElement(input);
        
        // 滚动到元素位置
        scrollToElement(input);
    }

    /**
     * 查找输入元素
     * @param {string} fieldId - 字段ID
     * @returns {HTMLElement|null}
     */
    findInput(fieldId) {
        return document.querySelector(`input[name="${fieldId}"]`) || 
               document.querySelector(`#${fieldId}`) ||
               document.querySelector(`[data-field="${fieldId}"]`);
    }

    /**
     * 格式化字段值
     * @param {HTMLElement} input - 输入元素
     * @param {string} value - 原始值
     * @returns {string}
     */
    formatValue(input, value) {
        switch(input.type) {
            case 'date':
                return formatDate(value);
            case 'number':
                return formatAmount(value);
            default:
                return value.trim();
        }
    }

    /**
     * 触发表单事件
     * @param {HTMLElement} input - 输入元素
     */
    triggerEvents(input) {
        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            input.dispatchEvent(event);
        });
    }

    /**
     * 清除表单
     */
    clearForm() {
        Object.keys(this.fieldMapping).forEach(fieldId => {
            const input = this.findInput(fieldId);
            if (input) {
                input.value = '';
                this.triggerEvents(input);
            }
        });
    }

    /**
     * 验证填充结果
     * @returns {Object} - 验证结果
     */
    validateFill() {
        const errors = [];
        const filled = [];

        Object.keys(this.fieldMapping).forEach(fieldId => {
            const input = this.findInput(fieldId);
            if (input) {
                if (!input.value.trim()) {
                    errors.push(fieldId);
                } else {
                    filled.push(fieldId);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            filled,
            total: Object.keys(this.fieldMapping).length
        };
    }

    /**
     * 获取表单数据
     * @returns {Object}
     */
    getFormData() {
        const data = {};
        Object.keys(this.fieldMapping).forEach(fieldId => {
            const input = this.findInput(fieldId);
            if (input) {
                data[fieldId] = input.value.trim();
            }
        });
        return data;
    }
} 