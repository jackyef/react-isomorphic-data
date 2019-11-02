/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Declarative</>,
    imageUrl: 'img/undraw_react.svg',
    description: (
      <>
        Declare the data required by your components in the components themselves!
      </>
    ),
  },
  {
    title: <>Full SSR Support</>,
    imageUrl: 'img/undraw_code_review.svg',
    description: (
      <>
        Everything works on SSR with little changes in your server code.
      </>
    ),
  },
  // {
  //   title: <>Hooks!</>,
  //   imageUrl: 'img/undraw_tweetstorm.svg',
  //   description: (
  //     <>
  //       What everyone is tweeting about these days.
  //     </>
  //   ),
  // },
  {
    title: <>Lightweight</>,
    imageUrl: `img/undraw_file_bundle.svg`,
    description: (
      <>Less than 5 kB gzipped</>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Easily fetch data in your ⚛️ React app, with full SSR support! 🎉">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title"><code>react-isomorphic-data</code></h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/intro')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({imageUrl, title, description}, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--4', styles.feature)}>
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={useBaseUrl(imageUrl)}
                          alt={title}
                        />
                      </div>
                    )}
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
