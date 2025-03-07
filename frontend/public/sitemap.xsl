<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            max-width: 75em;
            margin: 0 auto;
            padding: 2em;
            background: #f7f7f7;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th, td {
            padding: 1em;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background-color: #4a5568;
            color: white;
            font-weight: normal;
          }
          h1 {
            color: #2d3748;
            font-weight: normal;
            margin-bottom: 1em;
          }
          td {
            color: #4a5568;
          }
          tr:hover td {
            background: #f5f5f5;
          }
          a {
            color: #2b6cb0;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>אתר בית הכנסת חזון יוסף - מפת אתר</h1>
        <table>
          <tr>
            <th>URL</th>
            <th>תדירות עדכון</th>
            <th>תאריך עדכון אחרון</th>
            <th>עדיפות</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <xsl:variable name="itemURL">
                  <xsl:value-of select="sitemap:loc"/>
                </xsl:variable>
                <a href="{$itemURL}">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <td>
                <xsl:value-of select="sitemap:changefreq"/>
              </td>
              <td>
                <xsl:value-of select="sitemap:lastmod"/>
              </td>
              <td>
                <xsl:value-of select="sitemap:priority"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
