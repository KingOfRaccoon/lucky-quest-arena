/**
 * Сервис для работы с API с поддержкой логирования запросов
 */

/**
 * Базовый URL API
 */
export const API_BASE_URL = 'https://5.129.199.72:9090';

/**
 * Опции для настройки логирования
 */
export const loggerOptions = {
  enabled: true, // включено ли логирование
  logRequestBody: true, // логировать ли тело запроса
  logResponseBody: true, // логировать ли тело ответа
  logHeaders: false, // логировать ли заголовки
};

/**
 * Интерфейс для кастомных опций запроса
 */
interface RequestOptions extends RequestInit {
  skipLogging?: boolean; // пропустить логирование для данного запроса
}

/**
 * Функция для логирования запроса и ответа
 * @param url URL запроса
 * @param options Опции запроса
 * @param response Ответ от сервера
 * @param responseBody Тело ответа
 * @param startTime Время начала запроса
 */
const logApiCall = async (
  url: string,
  options: RequestInit,
  response?: Response,
  responseBody?: any,
  startTime?: number
) => {
  if (!loggerOptions.enabled) return;

  const method = options.method || 'GET';
  const endTime = performance.now();
  const duration = startTime ? `${(endTime - startTime).toFixed(2)}ms` : 'unknown';

  // Создаем группу логов для запроса
  console.group(`%c API ${method} ${url}`, 'color: #2563eb; font-weight: bold;');
  console.log(`%c ⏱️ Duration: ${duration}`, 'color: #0369a1');

  // Логируем URL и метод
  console.log(`%c 📨 Request: ${method} ${url}`, 'color: #4b5563');

  // Логируем тело запроса, если оно есть и включено логирование тел запросов
  if (loggerOptions.logRequestBody && options.body) {
    try {
      const bodyData = typeof options.body === 'string'
        ? JSON.parse(options.body)
        : options.body;
      console.log('%c 📦 Request Body:', 'color: #4b5563', bodyData);
    } catch (e) {
      console.log('%c 📦 Request Body:', 'color: #4b5563', options.body);
    }
  }

  // Логируем заголовки запроса, если включено логирование заголовков
  if (loggerOptions.logHeaders && options.headers) {
    console.log('%c 📋 Request Headers:', 'color: #4b5563', options.headers);
  }

  // Если был ответ, логируем его статус и тело
  if (response) {
    const statusColor = response.ok ? '#16a34a' : '#dc2626';
    console.log(`%c 📬 Response: ${response.status} ${response.statusText}`, `color: ${statusColor}`);

    // Логируем заголовки ответа, если включено логирование заголовков
    if (loggerOptions.logHeaders) {
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('%c 📋 Response Headers:', 'color: #4b5563', responseHeaders);
    }

    // Логируем тело ответа, если оно есть и включено логирование тел ответов
    if (loggerOptions.logResponseBody && responseBody !== undefined) {
      console.log('%c 📦 Response Body:', 'color: #4b5563', responseBody);
    }
  }

  // Закрываем группу логов
  console.groupEnd();
};

/**
 * Выполнить запрос к API с автоматическим логированием
 * @param url Относительный или полный URL запроса
 * @param options Опции запроса (RequestInit + skipLogging)
 * @returns Promise с результатом запроса
 */
export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  // Формируем полный URL, если передан относительный
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  // Время начала запроса для расчета длительности
  const startTime = performance.now();

  // Выполняем запрос
  try {
    const response = await fetch(fullUrl, options);

    // Преобразуем ответ в JSON или текст, в зависимости от Content-Type
    let responseBody;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    // Логируем запрос и ответ, если логирование не отключено для данного запроса
    if (!options.skipLogging) {
      await logApiCall(fullUrl, options, response, responseBody, startTime);
    }

    // Если статус не OK, выбрасываем ошибку
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return responseBody as T;
  } catch (error) {
    // Логируем ошибку, если логирование не отключено для данного запроса
    if (!options.skipLogging) {
      console.error(`%c 🚨 API Error for ${fullUrl}:`, 'color: #dc2626', error);
      await logApiCall(fullUrl, options, undefined, undefined, startTime);
    }
    throw error;
  }
};

/**
 * GET запрос
 * @param url URL запроса
 * @param options Дополнительные опции
 * @returns Promise с результатом запроса
 */
export const get = <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'GET',
    ...options,
  });
};

/**
 * POST запрос
 * @param url URL запроса
 * @param body Тело запроса
 * @param options Дополнительные опции
 * @returns Promise с результатом запроса
 */
export const post = <T>(url: string, body: any, options: RequestOptions = {}): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });
};

/**
 * PUT запрос
 * @param url URL запроса
 * @param body Тело запроса
 * @param options Дополнительные опции
 * @returns Promise с результатом запроса
 */
export const put = <T>(url: string, body: any, options: RequestOptions = {}): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });
};

/**
 * DELETE запрос
 * @param url URL запроса
 * @param options Дополнительные опции
 * @returns Promise с результатом запроса
 */
export const del = <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  return apiRequest<T>(url, {
    method: 'DELETE',
    ...options,
  });
};
