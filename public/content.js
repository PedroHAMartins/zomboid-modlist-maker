
(function() {
    'use strict';

    function createModlistButton(workshopItem) {
        if (workshopItem.querySelector('.zmh-modlist-button')) {
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'zmh-modlist-button';
        buttonContainer.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Add to Modlist';
        buttonText.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const icon = document.createElement('span');
        icon.innerHTML = '📋';
        icon.style.cssText = `
            font-size: 16px;
        `;

        buttonText.prepend(icon);
        buttonContainer.appendChild(buttonText);

        buttonContainer.addEventListener('mouseenter', () => {
            buttonContainer.style.transform = 'translateY(-1px)';
            buttonContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });

        buttonContainer.addEventListener('mouseleave', () => {
            buttonContainer.style.transform = 'translateY(0)';
            buttonContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });

        buttonContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            buttonText.textContent = 'Loading...';
            buttonContainer.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            
            try {
                const basicModInfo = extractModInfo(workshopItem);
                
                if (!basicModInfo.publishedFileId || !basicModInfo.url) {
                    throw new Error('Could not extract mod information');
                }
                
                const modDetails = await fetchModDetails(basicModInfo.url);
                
                const completeModInfo = {
                    publishedFileId: basicModInfo.publishedFileId,
                    modName: basicModInfo.modName,
                    url: basicModInfo.url,
                    modIds: modDetails.modIds,
                    mapFolders: modDetails.mapFolders
                };
                
                chrome.runtime.sendMessage({
                    action: 'addToModlist',
                    modInfo: completeModInfo
                }, (response) => {
                    if (response && response.success) {
                        buttonText.textContent = 'Added to Modlist ✓';
                        buttonContainer.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
                        
                        setTimeout(() => {
                            buttonText.textContent = 'Add to Modlist';
                            buttonContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }, 2000);
                    } else {
                        buttonText.textContent = 'Error - Try Again';
                        buttonContainer.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                        
                        setTimeout(() => {
                            buttonText.textContent = 'Add to Modlist';
                            buttonContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }, 2000);
                    }
                });
                
            } catch (error) {
                buttonText.textContent = 'Error - Try Again';
                buttonContainer.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    buttonText.textContent = 'Add to Modlist';
                    buttonContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 2000);
            }
        });

        return buttonContainer;
    }

    function extractModInfo(workshopItem) {
        const modInfo = {
            publishedFileId: null,
            modName: null,
            modIds: [],
            mapFolders: [],
            url: null
        };

        const linkElement = workshopItem.querySelector('a[data-publishedfileid]');
        if (linkElement) {
            modInfo.publishedFileId = linkElement.getAttribute('data-publishedfileid');
            modInfo.url = linkElement.getAttribute('href');
        }

        const titleElement = workshopItem.querySelector('.workshopItemTitle');
        if (titleElement) {
            modInfo.modName = titleElement.textContent.trim();
        }

        return modInfo;
    }

    function parseDescriptionText(text) {
        const result = {
            modIds: [],
            mapFolders: []
        };
        
        let normalizedText = text
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        const fieldPatterns = [
            { name: 'workshopId', pattern: /Workshop\s*ID\s*:\s*/gi },
            { name: 'modId', pattern: /Mod\s*ID\s*:\s*/gi },
            { name: 'mapFolder', pattern: /Map\s*Folder\s*:\s*/gi }
        ];
        
        const fieldMatches = [];
        
        fieldPatterns.forEach(field => {
            let match;
            while ((match = field.pattern.exec(normalizedText)) !== null) {
                fieldMatches.push({
                    name: field.name,
                    position: match.index,
                    fullMatch: match[0]
                });
            }
        });
        
        fieldMatches.sort((a, b) => a.position - b.position);
        
        
        for (let i = 0; i < fieldMatches.length; i++) {
            const currentField = fieldMatches[i];
            const nextField = fieldMatches[i + 1];
            
            const startPos = currentField.position + currentField.fullMatch.length;
            
            let endPos = nextField ? nextField.position : normalizedText.length;
            
            if (currentField.name === 'modId' || currentField.name === 'mapFolder') {
                const lineEnd = normalizedText.indexOf('\n', startPos);
                const nextFieldPos = nextField ? nextField.position : normalizedText.length;
                
                endPos = Math.min(
                    lineEnd !== -1 ? lineEnd : normalizedText.length,
                    nextFieldPos
                );
                
                if (!nextField) {
                    const endPatterns = [
                        /\s*&gt;!.*$/i,
                        /\s*<br><br>.*$/i,
                        /\s*\*\*.*$/i,
                        /\s*- \*.*$/i,
                    ];
                    
                    for (const pattern of endPatterns) {
                        const match = normalizedText.substring(startPos).match(pattern);
                        if (match) {
                            endPos = startPos + match.index;
                            break;
                        }
                    }
                }
            }
            
            let value = normalizedText.substring(startPos, endPos).trim();
            
            value = value.replace(/\s*(Workshop\s*ID|Mod\s*ID|Map\s*Folder)\s*:\s*.*$/i, '').trim();
            
            if (currentField.name === 'modId') {
                value = value.replace(/\s*&gt;!.*$/i, '').trim();
                value = value.replace(/\s*<br><br>.*$/i, '').trim();
                value = value.replace(/\s*\*\*.*$/i, '').trim();
                value = value.replace(/\s*- \*.*$/i, '').trim();
                value = value.replace(/\s*[\u{1F600}-\u{1F64F}].*$/u, '').trim();
                value = value.replace(/\s*[\u{1F300}-\u{1F5FF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{1F680}-\u{1F6FF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{1F1E0}-\u{1F1FF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{2600}-\u{26FF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{2700}-\u{27BF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{1F900}-\u{1F9FF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{1FA70}-\u{1FAFF}].*$/u, '').trim();
                value = value.replace(/\s*[\u{2B50}-\u{2B55}].*$/u, '').trim();
            }
            
            
            if (value) {
                if (currentField.name === 'modId' && !result.modIds.includes(value)) {
                    result.modIds.push(value);
                } else if (currentField.name === 'mapFolder' && !result.mapFolders.includes(value)) {
                    result.mapFolders.push(value);
                }
            }
        }
        
        return result;
    }

    async function fetchModDetails(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const modDetails = {
                modIds: [],
                mapFolders: []
            };

            let descriptionText = '';
            const selectors = [
                '.workshopItemDescription',
                '.workshopItemDescriptionText',
                '.workshopItemDetails',
                '#workshopItemDescription',
                '.workshopItemDetailsContainer .workshopItemDescription'
            ];
            
            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    descriptionText = element.textContent;
                    break;
                }
            }
            
            if (!descriptionText) {
                descriptionText = doc.body.textContent;
            }
            
            if (descriptionText) {
                const parsed = parseDescriptionText(descriptionText);
                modDetails.modIds = parsed.modIds;
                modDetails.mapFolders = parsed.mapFolders;
            } else {
            }
            

            return modDetails;
        } catch (error) {
            return { modIds: [], mapFolders: [] };
        }
    }

    function injectButtons() {
        const workshopItems = document.querySelectorAll('.workshopItem');
        
        if (workshopItems.length === 0) {
            const mainContent = document.querySelector('#mainContents') || 
                              document.querySelector('.workshopItemDetailsContainer');
            if (mainContent) {
                const button = createModlistButton(mainContent);
                mainContent.appendChild(button);
            }
        } else {
            workshopItems.forEach(item => {
                const button = createModlistButton(item);
                item.appendChild(button);
            });
        }
    }

    function observeAndInject() {
        const observer = new MutationObserver((mutations) => {
            let shouldInject = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('workshopItem')) {
                                shouldInject = true;
                            } else if (node.querySelector && node.querySelector('.workshopItem')) {
                                shouldInject = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldInject) {
                setTimeout(injectButtons, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectButtons();
            observeAndInject();
        });
    } else {
        injectButtons();
        observeAndInject();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(injectButtons, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();
