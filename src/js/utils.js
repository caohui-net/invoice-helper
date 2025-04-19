// 工具函数

/**
 * 创建带样式的DOM元素
 * @param {string} tag - 标签名
 * @param {Object} attributes - 属性对象
 * @param {string} className - CSS类名
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, className = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    if (className) {
        element.className = className;
    }
    return element;
}

/**
 * 添加样式到页面
 * @param {string} cssText - CSS文本
 */
export function injectStyles(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 格式化错误消息
 * @param {Error} error - 错误对象
 * @returns {string}
 */
export function formatError(error) {
    if (error.response) {
        return `服务器错误: ${error.response.status} ${error.response.statusText}`;
    }
    return error.message || '未知错误';
}

/**
 * 验证图片文件
 * @param {File} file - 文件对象
 * @returns {boolean}
 */
export function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        throw new Error('不支持的图片格式，请使用JPG、PNG或GIF格式');
    }

    if (file.size > maxSize) {
        throw new Error('图片大小不能超过5MB');
    }

    return true;
}

/**
 * 高亮显示元素
 * @param {HTMLElement} element - 要高亮的元素
 * @param {number} duration - 持续时间（毫秒）
 */
export function highlightElement(element, duration = 2000) {
    element.classList.add('field-highlight');
    setTimeout(() => {
        element.classList.remove('field-highlight');
    }, duration);
}

/**
 * 读取图片文件并返回base64
 * @param {File} file - 图片文件
 * @returns {Promise<string>}
 */
export function readImageAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('图片读取失败'));
        reader.readAsDataURL(file);
    });
}

/**
 * 检查元素是否在视口中
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean}
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 滚动到元素位置
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 滚动选项
 */
export function scrollToElement(element, options = { behavior: 'smooth', block: 'center' }) {
    if (!isInViewport(element)) {
        element.scrollIntoView(options);
    }
}

/**
 * 创建加载指示器
 * @param {string} message - 加载提示信息
 * @returns {HTMLElement}
 */
export function createLoadingIndicator(message = '处理中...') {
    const indicator = createElement('div', {}, 'status-message');
    indicator.textContent = message;
    return indicator;
}

/**
 * 格式化日期字符串
 * @param {string} dateStr - 日期字符串
 * @returns {string} - 格式化后的日期（YYYY-MM-DD）
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化金额
 * @param {string|number} amount - 金额
 * @returns {string} - 格式化后的金额
 */
export function formatAmount(amount) {
    return Number(amount).toFixed(2);
} 