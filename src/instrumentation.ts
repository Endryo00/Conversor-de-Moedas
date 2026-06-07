import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

// 1. Inicializa o provedor passando o SpanProcessor diretamente na criação
const provider = new WebTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())]
});

// 2. Registra o gerenciador de contexto para não perder o rastro nos cliques do React
provider.register({
  contextManager: new ZoneContextManager(),
});

// 3. Ativa a captura automática de requisições HTTP (fetch) de forma segura para APIs externas
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new FetchInstrumentation({
      // Deixamos vazio ou não definimos para que o OTel monitore o tempo da requisição,
      // mas não envie cabeçalhos customizados que quebrem o CORS de APIs de terceiros.
      propagateTraceHeaderCorsUrls: [], 
    }),
  ],
});

console.log('[OTel] OpenTelemetry inicializado com sucesso no Front-end!');