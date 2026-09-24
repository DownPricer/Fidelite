# Graph Report - Cartefidelité  (2026-09-24)

## Corpus Check
- 596 files · ~4,732,981 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3207 nodes · 9835 edges · 166 communities (145 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `baab6b79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- customer-reward-progress.ts
- card-template-schema.ts
- scan/ui.tsx
- merchant-card-slots.test.ts
- next
- react
- loyalty-labels.ts
- ref_next_navigation
- fife-life/merchant-detail.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- session.ts
- card-editor-properties.tsx
- requireMutatingRequest
- loyalty-service.ts
- marketing-balance/route.ts
- wallet-hydration.test.tsx
- cn
- use-wallet-unlock-animation.ts
- outils/ui.tsx
- profile-page.tsx
- money.ts
- customer-loyalty-overview.ts
- google-auth.ts
- ref_next_server
- jsonError
- caisse-client-number.test.ts
- loyalty-commit.ts
- advantages-ui.tsx
- campaign-quota.test.ts
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- CardEditorPage
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- globalObjectBody
- demo-session.ts
- What You Must Do When Invoked
- scan-session.ts
- media-storage.ts
- loyalty-commit.test.ts
- interactive-loyalty-card.tsx
- ref_fs_promises
- ref_next_headers
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- wallet-home.tsx
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- merchant-card-template-service.ts
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- programme/ui.tsx
- loyalty-context.ts
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- card-deck.tsx
- merchants-list.tsx
- types.ts
- AdvantagesEditor
- cashier-checkout.tsx
- caisse-scan.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- stripe.ts
- layout-shell.tsx
- cartes.js
- Fidelo
- docker-entrypoint.sh
- qr.ts
- merchant-card-renderer.tsx
- customer-preferences-route.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- vitest
- rbac.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- landing-header.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- prisma.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- CreateMerchantWizard
- ad-confirm-route.test.ts
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- resolvePublishedMerchantCardTemplate
- landing-page.test.ts
- caisse-scan-route.test.ts
- merchant-card-finish.test.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- customer-push-route.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- merchant-create-service.ts
- campaign-crud-routes.test.ts
- deletion/confirm/route.ts
- preferences/route.ts
- push-client.ts
- google-wallet-doctor.ts
- getSessionUser
- @prisma/client
- landing-merchant-preview.tsx
- jsonOk
- card-editor.tsx
- CampaignWizard
- loyalty-mode-cards.test.ts
- use-media-query.ts
- caisse-scan.test.ts
- env.ts
- SettingsPanel
- marketing-topup-route.test.ts
- campaign-lifecycle.ts
- pickCanonicalTemplate
- marketing-balance.test.ts
- SponsorWizard
- customer-qr-route.test.ts
- app/statistiques/page.tsx
- customer-notifications-route.test.ts
- scripts/campaign-worker.ts
- CampagnesPanel
- invitation/page.tsx
- capture-employe-screenshots.mjs
- campaign-audience.test.ts
- QuotaExceededError

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 191 edges
2. `jsonOk()` - 173 edges
3. `requireMutatingRequest()` - 117 edges
4. `prisma` - 110 edges
5. `vitest` - 96 edges
6. `react` - 95 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `progressTargetForBalance()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-context.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (166 total, 21 thin omitted)

### Community 0 - "customer-reward-progress.ts"
Cohesion: 0.21
Nodes (16): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+8 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (28): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_SCHEMA_VERSION, CardDecorativeStyle (+20 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.11
Nodes (19): ADMIN_PERMISSIONS, ScanResult, EmployeeProfile, Phase, ScanResult, CashierScanResult, ClientNumberField(), CaisseScanRequest (+11 more)

### Community 3 - "merchant-card-slots.test.ts"
Cohesion: 0.20
Nodes (13): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), merchantCardsGalleryPath(), parseCardSlotSlug() (+5 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.10
Nodes (25): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), ChangePasswordPage(), LOYALTY_MODES, STEPS (+17 more)

### Community 6 - "loyalty-labels.ts"
Cohesion: 0.22
Nodes (18): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), buildGoogleWalletMerchantView(), ActiveMerchantLoyaltyContext, progressTargetForBalance(), isPurchaseAmountRequired() (+10 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.25
Nodes (20): ref_next_navigation, CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage() (+12 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.09
Nodes (20): ref_react_dom_server, CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+12 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (22): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+14 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (52): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+44 more)

### Community 11 - "validation.ts"
Cohesion: 0.07
Nodes (43): zod, POST(), POST(), POST(), DELETE(), POST(), POST(), PUT() (+35 more)

### Community 12 - "session.ts"
Cohesion: 0.16
Nodes (18): POST(), POST(), GET(), POST(), schema, GET(), DELETE(), GET() (+10 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (61): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+53 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.13
Nodes (49): POST(), POST(), POST(), schema, DELETE(), POST(), POST(), POST() (+41 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.30
Nodes (11): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot, applyLoyaltyAction(), ApplyLoyaltyInput (+3 more)

### Community 16 - "marketing-balance/route.ts"
Cohesion: 0.12
Nodes (27): POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST() (+19 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.12
Nodes (21): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode() (+13 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (29): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+21 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.13
Nodes (27): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+19 more)

### Community 20 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 21 - "profile-page.tsx"
Cohesion: 0.08
Nodes (35): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), SheetAction(), HistoryFilter, ProfilePage() (+27 more)

### Community 22 - "money.ts"
Cohesion: 0.13
Nodes (23): AmountField(), press(), KEYS, assertEarnProgramRules(), RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions (+15 more)

### Community 23 - "customer-loyalty-overview.ts"
Cohesion: 0.12
Nodes (31): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, activityFromWalletEvent() (+23 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "ref_next_server"
Cohesion: 0.13
Nodes (18): ref_next_server, hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), assertSuperAdminProductionConfig() (+10 more)

### Community 26 - "jsonError"
Cohesion: 0.15
Nodes (19): GET(), PATCH(), GET(), POST(), GET(), POST(), GET(), POST() (+11 more)

### Community 27 - "caisse-client-number.test.ts"
Cohesion: 0.13
Nodes (16): CaisseScreen(), EmployeeScanScreen(), statusLabel(), ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, isMembershipConfirmationRequired() (+8 more)

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (50): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+42 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.18
Nodes (27): POST(), POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience() (+19 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.14
Nodes (22): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+14 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (25): description, engines, node, name, prisma, seed, private, version (+17 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.07
Nodes (37): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+29 more)

### Community 37 - "globalObjectBody"
Cohesion: 0.24
Nodes (16): appLinkData(), availableRewardModules(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData(), isPublicHttpsImageUrl() (+8 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.12
Nodes (21): GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, demoCookieNamesForRole(), demoEnterTarget() (+13 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan-session.ts"
Cohesion: 0.25
Nodes (17): html5-qrcode, formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter() (+9 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (28): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+20 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.10
Nodes (17): ref_fs_promises, ref_os, ref_sharp, OUT, tiers, files, INPUT_DIR, GET() (+9 more)

### Community 45 - "ref_next_headers"
Cohesion: 0.17
Nodes (16): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+8 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (30): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.17
Nodes (20): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, modeChangeHasIncompatibleRewards() (+12 more)

### Community 50 - "wallet-home.tsx"
Cohesion: 0.16
Nodes (12): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletCardsList(), WalletHome(), buildFifeLifeNextReward(), googleWalletEndpointForActiveCard(), resolveNextRewardForActiveCard() (+4 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (40): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+32 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (26): ref_node_fs_promises, ref_node_path, playwright, OUT, shots, OUT, OUT, shots (+18 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.16
Nodes (33): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+25 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.06
Nodes (68): GET(), PERIOD_KEYS, requireMerchantStatsAccess(), addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys() (+60 more)

### Community 58 - "merchant-card-template-service.ts"
Cohesion: 0.21
Nodes (18): normalizeCardTemplateForSlot(), isLoyaltyProgramSlot(), loyaltyModeForCardSlot(), adaptTemplateConfigForCardSlot(), applySharedBackgroundToModeTemplates(), CreateMerchantCardSlotsInput, defaultTemplateConfigForSlot(), duplicateTemplateToModes() (+10 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.11
Nodes (24): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY (+16 more)

### Community 60 - "ref_next_link"
Cohesion: 0.13
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.20
Nodes (14): MerchantInteractiveCard(), QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), inflight (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 67 - "loyalty-context.ts"
Cohesion: 0.14
Nodes (20): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational(), isProgramOperational() (+12 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (14): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+6 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "types.ts"
Cohesion: 0.17
Nodes (9): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantInteractiveCardProps, MerchantRoulette(), PREVIEW_QR, MerchantCardData, PublicMerchant (+1 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "cashier-checkout.tsx"
Cohesion: 0.23
Nodes (13): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+5 more)

### Community 75 - "caisse-scan.ts"
Cohesion: 0.18
Nodes (19): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+11 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.22
Nodes (12): stripe, isStripeConfigured(), CampaignCheckoutInput, checkoutExpiry(), createCampaignCheckoutSession(), createMarketingTopupCheckoutSession(), getStripeClient(), MarketingTopupCheckoutInput (+4 more)

### Community 80 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (18): recharts, AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, ACTIVITY_LABELS, DashboardHome() (+10 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (27): ref_node_fs, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+19 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (24): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+16 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, BalanceData, CampaignSummary, Channel (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "vitest"
Cohesion: 0.13
Nodes (13): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+5 more)

### Community 102 - "rbac.ts"
Cohesion: 0.11
Nodes (25): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+17 more)

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 105 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "prisma.ts"
Cohesion: 0.09
Nodes (30): POST(), schema, GET(), DELETE(), FILTER_MAP, GET(), dynamic, GET() (+22 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.27
Nodes (12): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+4 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.14
Nodes (11): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+3 more)

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (16): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+8 more)

### Community 124 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.26
Nodes (10): GET(), LOYALTY_MODES, GET(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep, adaptTemplateConfigForGeneralSlot(), findPublishedForSlot() (+2 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 127 - "merchant-card-finish.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.26
Nodes (11): handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), creditTopup(), MAX_TOPUP_CENTS (+3 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "cards-index.tsx"
Cohesion: 0.33
Nodes (10): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+2 more)

### Community 132 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "merchant-create-service.ts"
Cohesion: 0.23
Nodes (9): createAllModeTemplatesForMerchant(), createMerchantCardSlots(), createMerchantFull(), CreateMerchantInput, MERCHANT_STATUS_LABELS, syncIsActiveFromStatus(), merchantFindUnique, transaction (+1 more)

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "deletion/confirm/route.ts"
Cohesion: 0.26
Nodes (9): POST(), POST(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), avatarUploadSchema (+1 more)

### Community 138 - "preferences/route.ts"
Cohesion: 0.19
Nodes (16): GET(), PATCH(), GET(), PATCH(), bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION (+8 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.46
Nodes (7): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl()

### Community 141 - "getSessionUser"
Cohesion: 0.17
Nodes (12): dynamic, MerchantProfilePage(), EmployeeLoginPage(), ProEntryPage(), SPACES, JoinMerchantPage(), getPublishedCardTemplate(), getEmployeeSession() (+4 more)

### Community 142 - "@prisma/client"
Cohesion: 0.18
Nodes (14): @prisma/client, GET(), loadProgram(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData() (+6 more)

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "jsonOk"
Cohesion: 0.12
Nodes (33): GET(), GET(), POST(), DELETE(), GET(), loadOwnedCampaign(), PATCH(), GET() (+25 more)

### Community 145 - "card-editor.tsx"
Cohesion: 0.13
Nodes (12): PreviewScenario, PROGRESS_STEPS, SCENARIO_LABELS, CardTemplateBackground(), CardEditorBackgroundCrop(), Action, HistoryState, useEditorHistory() (+4 more)

### Community 146 - "CampaignWizard"
Cohesion: 0.20
Nodes (8): audienceDisplay(), CampaignWizard(), formatCents(), formatDate(), ledgerLabel(), MarketingBalanceCard(), topup(), startTopup()

### Community 147 - "loyalty-mode-cards.test.ts"
Cohesion: 0.20
Nodes (9): adaptTemplateConfigForLoyaltyMode(), ALL_LOYALTY_MODES, hasPublishedTemplateForMode(), merchantCardTemplateCount, merchantCardTemplateCreate, merchantCardTemplateFindFirst, merchantCardTemplateFindMany, merchantCardTemplateFindUnique (+1 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "env.ts"
Cohesion: 0.10
Nodes (21): assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken() (+13 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.22
Nodes (7): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 153 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 154 - "pickCanonicalTemplate"
Cohesion: 0.29
Nodes (8): displayStatusForSlot(), getEditableTemplateForSlot(), pickCanonicalTemplate(), pickCanonicalTemplateByMode(), resolveCurrentlyUsedSlot(), summarizeTemplateForMode(), summarizeTemplateForSlot(), templateRank()

### Community 155 - "marketing-balance.test.ts"
Cohesion: 0.36
Nodes (6): Entry, makeTx(), snapshot(), state, transaction(), uniqueViolation()

### Community 156 - "SponsorWizard"
Cohesion: 0.29
Nodes (5): addDaysToDateInput(), estimateSponsorPrice(), nowTimeInputValue(), SponsorWizard(), todayDateInputValue()

### Community 157 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 158 - "app/statistiques/page.tsx"
Cohesion: 0.40
Nodes (3): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage()

### Community 159 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 163 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

## Knowledge Gaps
- **807 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+802 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1080 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `card-template-schema.ts`, `merchant-card-slots.test.ts`, `customer-push-route.test.ts`, `react`, `loyalty-labels.ts`, `merchant-create-service.ts`, `campaign-crud-routes.test.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `push-client.ts`, `super-admin-campaign-moderation.test.ts`, `card-editor-properties.tsx`, `getSessionUser`, `@prisma/client`, `loyalty-service.ts`, `wallet-hydration.test.tsx`, `loyalty-mode-cards.test.ts`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `env.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `campaign-lifecycle.ts`, `money.ts`, `caisse-client-number.test.ts`, `loyalty-commit.ts`, `customer-qr-route.test.ts`, `campaign-quota.test.ts`, `customer-notifications-route.test.ts`, `campaigns/[id]/confirm/route.ts`, `marketing-balance.test.ts`, `package.json`, `[id]/merchant-detail.tsx`, `campaign-audience.test.ts`, `statistiques-panel.tsx`, `demo-session.ts`, `scan-session.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `loyalty-program-publication.ts`, `wallet-home.tsx`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `loyalty-context.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `card-deck.tsx`, `caisse-scan.ts`, `unsubscribe-token.ts`, `stripe.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `customer-preferences-route.test.ts`, `rbac.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `prisma.ts`, `marketing-topup-route.test.ts`, `ref_next_server`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `caisse-scan-route.test.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `webhook/route.ts`, `cards-index.tsx`, `merchant-card-slots.test.ts`, `scan/ui.tsx`, `loyalty-labels.ts`, `merchant-create-service.ts`, `loyalty-widget.ts`, `preferences/route.ts`, `session.ts`, `card-editor-properties.tsx`, `requireMutatingRequest`, `getSessionUser`, `loyalty-service.ts`, `card-editor.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `env.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `campaign-lifecycle.ts`, `money.ts`, `loyalty-commit.ts`, `advantages-ui.tsx`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `CardEditorPage`, `package.json`, `loyalty-program-publication.ts`, `wallet-home.tsx`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `merchant-card-template-service.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `loyalty-context.ts`, `types.ts`, `cashier-checkout.tsx`, `qr.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `rbac.ts`, `prisma.ts`, `employee-session.ts`, `resolvePublishedMerchantCardTemplate`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-slots.test.ts`, `discover-page.tsx`, `fife-life/merchant-detail.tsx`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `card-editor.tsx`, `cn`, `wallet-hydration.test.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `use-media-query.ts`, `advantages-ui.tsx`, `package.json`, `invitation/page.tsx`, `statistiques-panel.tsx`, `[id]/merchant-detail.tsx`, `scan-session.ts`, `interactive-loyalty-card.tsx`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `wallet-home.tsx`, `qa-login.ts`, `ref_next_link`, `qr-cache.ts`, `programme/ui.tsx`, `loyalty-context.ts`, `card-deck.tsx`, `merchants-list.tsx`, `types.ts`, `cashier-checkout.tsx`, `layout-shell.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _807 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10869565217391304 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09941944847605225 - nodes in this community are weakly interconnected._