'use client';

export default function DebugPage() {
  const envVars = {
    VERSION_MAJOR: process.env.NEXT_PUBLIC_VERSION_MAJOR,
    VERSION_MINOR: process.env.NEXT_PUBLIC_VERSION_MINOR,
    VERSION_PATCH: process.env.NEXT_PUBLIC_VERSION_PATCH,
    VERSION_PREFIX: process.env.NEXT_PUBLIC_VERSION_PREFIX,
    VERSION_COMMIT_TIME: process.env.NEXT_PUBLIC_VERSION_COMMIT_TIME,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">🔍 环境变量调试</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">版本信息</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">组合版本号</h2>
            <p className="text-2xl font-bold text-blue-600">
              {envVars.VERSION_PREFIX || 'v'}
              {envVars.VERSION_MAJOR || '?'}.
              {envVars.VERSION_MINOR || '?'}.
              {envVars.VERSION_PATCH || '?'}
              {envVars.VERSION_COMMIT_TIME ? ` (${envVars.VERSION_COMMIT_TIME})` : ''}
            </p>
          </div>

          <div className="pb-4">
            <h2 className="text-xl font-semibold mb-2">说明</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>如果看到 "?"，说明环境变量未设置</li>
              <li>本地开发：运行 <code className="bg-gray-200 px-2 py-1 rounded">./sync-config.sh</code></li>
              <li>Vercel部署：在 Project Settings → Environment Variables 中配置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

