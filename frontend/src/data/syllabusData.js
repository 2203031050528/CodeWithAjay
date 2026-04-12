// Full AI Engineer Curriculum - CodeWithAjay
// Each module has a color, icon key, and nested topics

const syllabusData = [
  {
    id: 'python',
    title: 'Python Programming',
    icon: '🐍',
    color: '#6366f1',
    sections: [
      {
        title: 'Foundation & Basics',
        topics: [
          {
            title: 'Environment Setup',
            items: ['Installing Python (latest version)', 'IDEs: VS Code, PyCharm, Jupyter', 'Terminal/Command Line basics', 'Python interpreter & REPL', 'Virtual environments (venv)'],
          },
          {
            title: 'Python Syntax Basics',
            items: ['Module', 'Comments (single & multi-line)', 'pip', 'Indentation rules', 'Variables & naming conventions', 'Print statements & output', 'Input from users', 'Basic code structure'],
          },
          {
            title: 'Data Types',
            items: ['Numbers (int, float, complex)', 'Strings (creation, indexing, slicing)', 'Boolean: True, False', 'Type conversion/casting', 'Type checking with type()', 'None type'],
          },
          {
            title: 'Operators',
            items: ['Arithmetic: +, -, *, /, //, %, **', 'Comparison: ==, !=, <, >, <=, >=', 'Logical: and, or, not', 'Assignment: =, +=, -=, etc.', 'Membership: in, not in', 'Identity: is, is not', 'Bitwise operators'],
          },
          {
            title: 'String Operations',
            items: ['String methods (upper, lower, strip, etc.)', 'String formatting (f-strings, format())', 'String concatenation', 'Escape characters', 'Raw strings', 'String multiplication'],
          },
        ],
      },
      {
        title: 'Control Flow & Logic',
        topics: [
          {
            title: 'Conditional Statements',
            items: ['if statements', 'if-else statements', 'elif (else if) chains', 'Nested conditions', 'Ternary operators', 'Match-case (Python 3.10+)'],
          },
          {
            title: 'Loops',
            items: ['for loops & iteration', 'while loops', 'break statement', 'continue statement', 'else clause in loops', 'Nested loops', 'Loop optimization techniques'],
          },
          {
            title: 'Range & Iteration',
            items: ['range() function', 'enumerate() function', 'zip() function', 'Iterator protocol basics'],
          },
        ],
      },
      {
        title: 'Data Structures',
        topics: [
          {
            title: 'Lists',
            items: ['Creating & accessing lists', 'List methods (append, extend, insert, remove)', 'List slicing & indexing', 'List comprehensions', 'Nested lists & 2D arrays', 'Sorting & reversing', 'Copying lists (shallow vs deep)'],
          },
          {
            title: 'Tuples',
            items: ['Creating tuples', 'Immutability concept', 'Tuple packing & unpacking', 'Named tuples', 'When to use tuples vs lists'],
          },
          {
            title: 'Dictionaries',
            items: ['Creating dictionaries', 'Accessing & modifying values', 'Dictionary methods (keys, values, items)', 'Dictionary comprehensions', 'Nested dictionaries', 'get() method & default values', 'Merging dictionaries'],
          },
          {
            title: 'Sets',
            items: ['Creating sets', 'Set operations (union, intersection)', 'Set methods (add, remove, discard)', 'Frozen sets', 'Set comprehensions'],
          },
          {
            title: 'Collections Module',
            items: ['Counter', 'defaultdict', 'OrderedDict', 'deque (double-ended queue)', 'ChainMap'],
          },
        ],
      },
      {
        title: 'Functions & Modules',
        topics: [
          {
            title: 'Function Basics',
            items: ['Defining functions (def keyword)', 'Parameters & arguments', 'Return values', 'Default parameters', 'Keyword arguments', '*args & **kwargs', 'Docstrings'],
          },
          {
            title: 'Advanced Functions',
            items: ['Lambda functions', 'Map, filter, reduce', 'Recursion', 'Nested functions', 'Closures', 'Function annotations'],
          },
          {
            title: 'Scope & Namespaces',
            items: ['Local vs global scope', 'global keyword', 'nonlocal keyword', 'LEGB rule', 'Namespace concept'],
          },
          {
            title: 'Modules & Packages',
            items: ['Importing modules', 'Creating your own modules', '__name__ == "__main__"', 'Package structure', '__init__.py files', 'Relative vs absolute imports', 'Standard library overview'],
          },
        ],
      },
      {
        title: 'Object-Oriented Programming',
        topics: [
          {
            title: 'OOP Fundamentals',
            items: ['Classes & objects', '__init__ constructor', 'Instance vs class variables', 'self parameter', 'Methods vs functions', 'Attributes'],
          },
          {
            title: 'OOP Principles',
            items: ['Encapsulation', 'Inheritance (single & multiple)', 'Polymorphism', 'Abstraction', 'Method overriding', 'super() function'],
          },
          {
            title: 'Special Methods',
            items: ['__str__ & __repr__', '__len__, __getitem__', '__add__, __sub__ (operator overloading)', '__call__, __enter__, __exit__', 'Magic/dunder methods'],
          },
          {
            title: 'Advanced OOP',
            items: ['Class methods (@classmethod)', 'Static methods (@staticmethod)', 'Property decorators (@property)', 'Abstract base classes (ABC)', 'Mixins', 'Metaclasses', 'Data classes (Python 3.7+)'],
          },
        ],
      },
      {
        title: 'File Handling & Error Management',
        topics: [
          {
            title: 'File Operations',
            items: ['Opening & closing files', 'Reading files (read, readline, readlines)', 'Writing to files', 'File modes (r, w, a, r+, etc.)', 'Context managers (with statement)', 'Binary files', 'File paths & os module'],
          },
          {
            title: 'Exception Handling',
            items: ['try-except blocks', 'Multiple except clauses', 'else & finally clauses', 'Raising exceptions', 'Custom exceptions', 'Exception hierarchy', 'Best practices'],
          },
          {
            title: 'Working with Different Formats',
            items: ['CSV files (csv module)', 'JSON files (json module)', 'XML files', 'Text file processing', 'Pickle for serialization'],
          },
        ],
      },
      {
        title: 'Scientific Python Stack',
        topics: [
          {
            title: 'NumPy',
            items: ['Arrays', 'Broadcasting', 'Vectorization'],
          },
          {
            title: 'Pandas',
            items: ['DataFrames', 'groupby', 'Merging', 'Cleaning'],
          },
          {
            title: 'Matplotlib & Seaborn',
            items: ['Plotting & visualization'],
          },
        ],
      },
      {
        title: 'ML Tooling',
        topics: [
          {
            title: 'Development Tools',
            items: ['Jupyter notebooks & Google Colab', 'Git & version control basics', 'Debugging & profiling'],
          },
        ],
      },
    ],
  },
  {
    id: 'ai-concepts',
    title: 'AI Terminology & Core Concepts',
    icon: '🧠',
    color: '#06b6d4',
    sections: [
      {
        title: 'AI vs ML vs DL vs AGI',
        topics: [
          {
            title: 'Understanding the Landscape',
            items: ['What is Artificial Intelligence?', 'Machine Learning as a subset of AI', 'Deep Learning as a subset of ML', 'AGI — what it means', 'Narrow AI vs General AI'],
          },
        ],
      },
      {
        title: 'How LLMs Work (Conceptually)',
        topics: [
          {
            title: 'Large Language Models',
            items: ['What is a Large Language Model?', 'Tokens & tokenization (words → numbers)', 'Context window', 'Inference vs Training', 'Parameters & model size'],
          },
        ],
      },
      {
        title: 'Sampling & Generation',
        topics: [
          {
            title: 'Generation Parameters',
            items: ['Temperature — creativity vs determinism', 'Top-K sampling', 'Top-P (nucleus) sampling'],
          },
        ],
      },
      {
        title: 'Key AI Concepts',
        topics: [
          {
            title: 'Terminology Overview',
            items: ['Embeddings', 'Vector databases', 'RAG', 'Fine-tuning', 'Prompt Engineering', 'Context Engineering', 'AI Agents', 'Hallucination', 'Grounding'],
            note: "Don't deep dive — just understand the terminology",
          },
        ],
      },
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools & Ecosystem',
    icon: '🛠️',
    color: '#10b981',
    sections: [
      {
        title: 'AI Coding Assistants',
        topics: [
          {
            title: 'Pick ONE',
            items: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf & Replit'],
          },
        ],
      },
      {
        title: 'Running Models Locally',
        topics: [
          {
            title: 'Local Inference',
            items: ['Ollama'],
          },
        ],
      },
      {
        title: 'Accessing Models via API',
        topics: [
          {
            title: 'Pick ONE',
            items: ['OpenAI API', 'Anthropic Claude Messages API'],
          },
        ],
      },
      {
        title: 'Hugging Face Ecosystem',
        topics: [
          {
            title: 'Awareness Level',
            items: ['Just know it exists — explore when needed'],
          },
        ],
      },
    ],
  },
  {
    id: 'data-skills',
    title: 'Data Skills',
    icon: '📊',
    color: '#f59e0b',
    sections: [
      {
        title: 'Data Wrangling',
        topics: [
          {
            title: 'Data Processing',
            items: ['Missing value imputation', 'Working with file formats (CSV, JSON, Parquet)', 'Outlier detection & treatment', 'Data type conversion & parsing', 'Regular expressions Basics', 'Merging & reshaping datasets'],
          },
        ],
      },
      {
        title: 'Exploratory Data Analysis (EDA)',
        topics: [
          {
            title: 'Analysis Techniques',
            items: ['Univariate & bivariate analysis', 'Correlation matrices & heatmaps', 'Distribution plots, box plots, scatter plots', 'Feature distributions & skewness'],
          },
        ],
      },
      {
        title: 'SQL & Databases',
        topics: [
          {
            title: 'SQL Essentials',
            items: ['SELECT, JOIN, GROUP BY, subqueries', 'Window functions'],
          },
        ],
      },
    ],
  },
  {
    id: 'math',
    title: 'Mathematics for AI',
    icon: '📐',
    color: '#8b5cf6',
    sections: [
      {
        title: 'Linear Algebra',
        topics: [
          {
            title: 'Core Concepts',
            items: ['Vectors', 'Matrix operations', 'Dot product'],
          },
          {
            title: 'Optional Deep Dive',
            items: ['Eigenvalues/eigenvectors', 'Cross product, projections'],
            optional: true,
          },
        ],
      },
      {
        title: 'Calculus',
        topics: [
          {
            title: 'Core Concepts',
            items: ['Derivatives (intuition, slope, rate of change)', 'Gradient', 'Loss function'],
          },
          {
            title: 'Optional Deep Dive',
            items: ['Chain rule & product rule', 'Multivariable calculus', 'Jacobian', 'Integration basics'],
            optional: true,
          },
        ],
      },
      {
        title: 'Probability & Statistics',
        topics: [
          {
            title: 'Core Concepts',
            items: ['Bayes theorem', 'Distributions (Normal, Binomial, Poisson, Beta)', 'Expectation, variance, covariance', 'Maximum Likelihood Estimation (MLE)'],
          },
          {
            title: 'Optional Deep Dive',
            items: ['Hypothesis testing & p-values', 'Central Limit Theorem', 'Markov chains'],
            optional: true,
          },
        ],
      },
      {
        title: 'Optimization',
        topics: [
          {
            title: 'Core Concepts',
            items: ['Gradient descent variants (SGD)'],
          },
          {
            title: 'Optional Deep Dive',
            items: ['Convexity & saddle points', 'Lagrange multipliers', 'Constrained optimization'],
            optional: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    icon: '🤖',
    color: '#ec4899',
    sections: [
      {
        title: 'Supervised Learning',
        topics: [
          {
            title: 'Regression',
            items: ['Linear regression (OLS)', 'Ridge, Lasso, ElasticNet', 'Polynomial regression', 'Logistic regression (binary & multinomial)'],
          },
          {
            title: 'Decision Trees & Ensembles',
            items: ['Decision tree (Gini, entropy, pruning)', 'Random Forest (bagging)', 'Gradient Boosting (XGBoost, LightGBM, CatBoost)'],
          },
          {
            title: 'Support Vector Machines',
            items: ['Kernel trick (RBF, polynomial)', 'SVM for classification & regression'],
          },
          {
            title: 'Naive Bayes & KNN',
            items: ['Gaussian, Multinomial, Bernoulli NB', 'K-Nearest Neighbors & distance metrics'],
          },
          {
            title: 'Model Evaluation',
            items: ['Train/val/test splits, k-fold CV', 'Bias-variance tradeoff', 'Accuracy, precision, recall, F1, ROC-AUC', 'Confusion matrix', 'Overfitting & underfitting diagnosis'],
          },
        ],
      },
      {
        title: 'Unsupervised Learning & Feature Engineering',
        topics: [
          {
            title: 'Clustering',
            items: ['K-Means (elbow method, silhouette)', 'DBSCAN'],
          },
          {
            title: 'Dimensionality Reduction',
            items: ['PCA (principal components)', 't-SNE & UMAP'],
          },
          {
            title: 'Feature Engineering',
            items: ['Encoding categoricals (OHE, target encoding)', 'Scaling (StandardScaler, MinMax, RobustScaler)', 'Feature creation & interaction terms', 'Binning & quantization'],
          },
          {
            title: 'Hyperparameter Tuning & Pipelines',
            items: ['Grid search & random search', 'sklearn Pipeline & ColumnTransformer'],
          },
        ],
      },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    icon: '🔬',
    color: '#f43f5e',
    sections: [
      {
        title: 'Neural Network Fundamentals',
        topics: [
          {
            title: 'Perceptron & Activation Functions',
            items: ['Single & multi-layer perceptron', 'ReLU, Sigmoid, Tanh, GELU, Swish, Softmax', 'Vanishing & exploding gradient problems'],
          },
          {
            title: 'Backpropagation & Training',
            items: ['Forward pass & loss computation', 'Backward pass & chain rule', 'Weight initialization (Xavier, He)', 'Learning rate schedules (cosine, warmup)'],
          },
          {
            title: 'Regularization',
            items: ['L1/L2 weight regularization', 'Batch normalization & Layer normalization', 'Early stopping & data augmentation'],
          },
          {
            title: 'Loss Functions',
            items: ['MSE, MAE, Huber (regression)', 'Cross-entropy, Focal Loss (classification)'],
          },
          {
            title: 'Frameworks',
            items: ['PyTorch: tensors, autograd, nn.Module (learn deeply)', 'TensorFlow / Keras (awareness level)'],
          },
        ],
      },
      {
        title: 'CNNs & Computer Vision',
        topics: [
          {
            title: 'CNN Building Blocks',
            items: ['Convolution operation & filters', 'Stride, padding, receptive field', 'Pooling (max, average, global)', 'Depthwise separable convolutions'],
            note: 'Optional if your goal is Agentic AI',
          },
          {
            title: 'CNN Architectures',
            items: ['LeNet → AlexNet → VGG → GoogLeNet', 'ResNet (skip connections)', 'DenseNet, EfficientNet, MobileNet'],
            note: 'Basic reading only',
          },
        ],
      },
      {
        title: 'Sequence Models & Transformers',
        topics: [
          {
            title: 'Core Concepts',
            items: ['RNNs & LSTMs — awareness only', 'Attention Mechanism', 'Transformer Architecture', 'Vision Transformers (for CV only)'],
          },
        ],
      },
    ],
  },
  {
    id: 'specializations',
    title: 'Specializations',
    icon: '🎯',
    color: '#14b8a6',
    sections: [
      {
        title: 'Choose Your Domain',
        topics: [
          {
            title: 'Domain Paths',
            items: ['Agentic AI → NLP only', 'Data Science / General ML → NLP + light Time Series', 'Robotics / Gaming → Reinforcement Learning', 'Finance / IoT → Time Series'],
            note: 'Advice: Go for Agentic AI and learn NLP only',
          },
        ],
      },
      {
        title: 'Natural Language Processing (NLP)',
        topics: [
          {
            title: 'Text Preprocessing',
            items: ['Tokenization (BPE, WordPiece, SentencePiece)', 'Text cleaning & normalization'],
          },
          {
            title: 'Word Representations',
            items: ['Bag of Words & TF-IDF', 'Word2Vec (CBOW & Skip-Gram)', 'GloVe & FastText', 'Contextual embeddings (BERT, ELMo)'],
          },
          {
            title: 'Core NLP Tasks',
            items: ['Sentiment analysis', 'Named entity recognition (NER)', 'Text classification', 'Question answering', 'Text summarization'],
          },
          {
            title: 'Pretrained Language Models',
            items: ['BERT & variants (RoBERTa, ALBERT, DistilBERT)', 'GPT family (GPT-2, GPT-3, GPT-4)', 'T5, BART, mT5 (multilingual — optional)'],
          },
          {
            title: 'NLP Libraries',
            items: ['Hugging Face Transformers & Datasets', 'spaCy & NLTK (optional)', 'LangChain & LlamaIndex'],
          },
        ],
      },
      {
        title: 'Reinforcement Learning',
        topics: [
          {
            title: 'RL Fundamentals',
            items: ['Agent, environment, state, action, reward', 'Markov Decision Processes (MDPs)', 'Policy, value function, Q-function', 'Bellman equations'],
            note: 'Only learn for Robotics or Gaming AI',
          },
          {
            title: 'Methods',
            items: ['Q-Learning & SARSA', 'Deep Q-Network (DQN)', 'PPO, SAC, A2C/A3C', 'RLHF (RL from Human Feedback)'],
          },
        ],
      },
      {
        title: 'Time Series & Forecasting',
        topics: [
          {
            title: 'Methods',
            items: ['ARIMA, SARIMA, ARIMAX', 'Exponential smoothing (Holt-Winters)', 'XGBoost/LightGBM for forecasting', 'LSTM/GRU for sequence forecasting', 'Transformers for TS (Informer, PatchTST)'],
            note: 'Only for Finance, IoT, or demand forecasting',
          },
        ],
      },
    ],
  },
  {
    id: 'genai',
    title: 'Generative AI & Agents',
    icon: '✨',
    color: '#a855f7',
    sections: [
      {
        title: 'Generative Models',
        topics: [
          {
            title: 'Overview',
            items: ['GANs', 'Variational Autoencoders (VAEs)', 'Diffusion Models (DDPM, DDIM)', 'Stable Diffusion, DALL-E, Imagen, FLUX', 'ComfyUI'],
            note: 'Not needed for Agentic AI path',
          },
        ],
      },
      {
        title: 'Embeddings, Vector DBs & RAG',
        topics: [
          {
            title: 'Embeddings Deep Dive',
            items: ['What embeddings are and why they matter', 'Semantic search using embeddings', 'Data classification & clustering', 'Recommendation systems', 'Anomaly detection', 'Embedding models: OpenAI, Gemini, Cohere', 'Open source: Sentence Transformers, Jina'],
          },
          {
            title: 'Vector Databases',
            items: ['Purpose & how vector DBs differ from SQL', 'Indexing embeddings (HNSW, IVF)', 'Similarity search (cosine, dot product, L2)', 'Chroma, Pinecone, Weaviate, FAISS, Qdrant, LanceDB'],
          },
          {
            title: 'RAG — Retrieval-Augmented Generation',
            items: ['RAG use cases & when to use RAG vs fine-tuning', 'Chunking strategies (fixed, semantic, recursive)', 'Embedding the chunks', 'Storing in vector DB', 'Retrieval process (similarity search)', 'Generation with retrieved context', 'Frameworks: LangChain, LlamaIndex, Haystack', 'Advanced RAG (re-ranking, HyDE, multi-query)'],
          },
        ],
      },
      {
        title: 'AI Agents & Agentic Systems',
        topics: [
          {
            title: 'Agent Fundamentals',
            items: ['What is an AI agent?', 'Agent use cases & real-world examples', 'ReAct prompting (Reason + Act loop)', 'Tools & function calling', 'Multi-agent systems'],
          },
          {
            title: 'Building AI Agents',
            items: ['Manual implementation from scratch', 'OpenAI AgentKit & Agents SDK', 'Claude Agent SDK (Anthropic)', 'Google ADK', 'LangGraph for stateful agents', 'AutoGen & CrewAI for multi-agent', 'Memory systems (short-term, long-term, semantic)'],
          },
          {
            title: 'MCP in Practice (Hands-on)',
            items: ['Learn MCP after building at least one basic agent', 'Building an MCP server step by step', 'Building an MCP client', 'Connecting agents to local tools via MCP', 'Connecting to remote MCP servers', 'MCP + agent frameworks'],
          },
          {
            title: 'Agent Safety & Reliability',
            items: ['Prompt injection attacks on agents', 'Tool use safety & sandboxing', 'Human-in-the-loop patterns', 'Evaluation & testing agents'],
          },
        ],
      },
    ],
  },
  {
    id: 'llms',
    title: 'Large Language Models (LLMs)',
    icon: '🗣️',
    color: '#0ea5e9',
    sections: [
      {
        title: 'LLM Architecture Deep Dive',
        topics: [
          {
            title: 'Core Architecture',
            items: ['Autoregressive pretraining', 'Scaling laws (Chinchilla)', 'Context length & long-context techniques', 'KV cache & efficient inference (optional)', 'Mixture of Experts (MoE)'],
          },
        ],
      },
      {
        title: 'Fine-Tuning & Alignment',
        topics: [
          {
            title: 'Techniques',
            items: ['Full fine-tuning', 'LoRA & QLoRA (parameter-efficient)', 'Prefix tuning & prompt tuning', 'Instruction tuning (FLAN, Alpaca)', 'RLHF (reward model + PPO)', 'DPO (Direct Preference Optimization)'],
          },
        ],
      },
      {
        title: 'Prompting & In-Context Learning',
        topics: [
          {
            title: 'Prompting Strategies',
            items: ['Zero-shot, one-shot, few-shot', 'Chain-of-thought (CoT) prompting', 'Tree-of-thought & ReAct', 'System prompting & role/behavior setting', 'Structured output prompting', 'Prompt injection & jailbreaks'],
          },
        ],
      },
      {
        title: 'Choosing the Right Model',
        topics: [
          {
            title: 'Model Options',
            items: ['Closed: Claude, GPT, Gemini, Cohere, Mistral', 'Open source: Llama, DeepSeek, Qwen, Gemma2', 'When to use closed vs open source', 'Cost, latency & capability tradeoffs', 'Self-hosted vs API-based decision'],
          },
        ],
      },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & Production Systems',
    icon: '🚀',
    color: '#f97316',
    sections: [
      {
        title: 'ML Engineering & MLOps',
        topics: [
          {
            title: 'Experiment Tracking',
            items: ['MLflow (runs, experiments, model registry)'],
          },
          {
            title: 'Model Serving & Deployment',
            items: ['REST APIs with FastAPI', 'ONNX (cross-framework export — optional)'],
          },
          {
            title: 'Containerization & Orchestration',
            items: ['Docker (Dockerfile, images, containers)', 'Kubernetes basics (pods, deployments)', 'Cloud platforms (AWS SageMaker, GCP Vertex, Azure ML)'],
          },
          {
            title: 'Monitoring & Observability',
            items: ['Data drift detection (Evidently, Alibi)', 'Model performance monitoring', 'Logging, metrics & alerting (optional)'],
          },
        ],
      },
      {
        title: 'Model Optimization & Efficiency',
        topics: [
          {
            title: 'Quantization',
            items: ['Post-training quantization (INT8, INT4)', 'GPTQ, AWQ, GGUF formats', 'bitsandbytes library'],
          },
          {
            title: 'Inference Optimization',
            items: ['FlashAttention', 'Speculative decoding (optional)', 'Continuous batching (vLLM)'],
          },
        ],
      },
    ],
    note: 'Learn this section after you\'ve shipped at least one real AI project.',
  },
];

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

syllabusData.forEach(module => {
  module.sections.forEach(section => {
    section.topics.forEach(topic => {
      topic.items = topic.items.map(item => ({
        title: item,
        topicId: `${module.id}-${generateSlug(topic.title)}-${generateSlug(item)}`
      }));
    });
  });
});

export default syllabusData;
