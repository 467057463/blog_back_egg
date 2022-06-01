module.exports = {
  apps : [
    {
      name: 'blog_back_egg',
      script: 'npm',
      args: 'run start',
      script: 'index.js',
      env: {
        "COMMON_VARIABLE": "true"
      },
      env_production: {
        "NODE_ENV": "production"
      }
    }
  ],

  deploy : {
    production : {
      user : 'root',
      host : '95.179.164.10',
      ref  : 'origin/main',
      repo : 'git@github.com:467057463/blog_back_egg.git',
      path : '/var/www/blog_back_egg',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install --production=false && npm run tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
};
