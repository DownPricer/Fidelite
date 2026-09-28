# Graph Report - Cartefidelité  (2026-09-28)

## Corpus Check
- 614 files · ~4,748,338 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3353 nodes · 10185 edges · 166 communities (141 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `847f3000`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- card-template-schema.ts
- rbac.ts
- merchant-card-template-service.ts
- next
- react
- loyalty-program.ts
- ref_next_navigation
- employee-session.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- loyalty-labels.ts
- scan-session.ts
- wallet-hydration.test.tsx
- cn
- use-wallet-unlock-animation.ts
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- loyalty-context.ts
- google-auth.ts
- env.ts
- tarifs/page.tsx
- prisma.ts
- loyalty-commit.ts
- advantages-ui.tsx
- wallet-home.tsx
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- deletion/confirm/route.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- types.ts
- ref_fs_promises
- ref_next_headers
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- playwright
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- MerchantCardData
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- caisse-client-number.test.ts
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- card-deck.tsx
- merchants-list.tsx
- merchant-card-renderer.tsx
- AdvantagesEditor
- verify-viewports.mjs
- ref_next_server
- unsubscribe/route.ts
- merchant-app-access.ts
- MerchantDetailPage
- ads/[id]/confirm/route.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- CardTemplateConfig
- campaign-moderation-home.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- marketing-balance.test.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- ref_path
- caisse-scan-route.test.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- requireUser
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- commit/route.ts
- insight-definitions.ts
- cards-index.tsx
- ad-confirm-route.test.ts
- qa-login/page.tsx
- campaign-confirm-route.test.ts
- sponsored-hours-pricing.ts
- GET
- exchange/route.ts
- @prisma/client
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- employee-access.test.ts
- employees/[id]/route.ts
- campaign-crud-routes.test.ts
- push.ts
- bucketKey
- statistiques-scroll.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- getEmployeeSession
- CreateMerchantWizard
- trim-card-images.mjs
- loyalty-cards-capture.mjs
- jsonError
- EmployeeLoginScreen
- CampagnesPanel
- cashier-checkout.tsx
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- invitation/page.tsx
- buildGoogleWalletMerchantView
- app/ui.tsx
- solde/ui.tsx
- capture-employe-app-screenshots.mjs
- capture-super-admin.mjs
- campaign-audience.test.ts
- scripts/campaign-worker.ts
- merchant-search-v1.mjs
- wallet-desktop-capture.mjs
- assertSuperAdminProductionConfig
- SelfVisualCropper
- landing-footer.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 193 edges
2. `jsonOk()` - 175 edges
3. `requireMutatingRequest()` - 118 edges
4. `prisma` - 110 edges
5. `vitest` - 100 edges
6. `react` - 97 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `progressTargetForBalance()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-context.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (166 total, 25 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.18
Nodes (19): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+11 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (28): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_FONT_OPTIONS, CardFontId (+20 more)

### Community 2 - "rbac.ts"
Cohesion: 0.11
Nodes (19): ClientsPage(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers() (+11 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (61): GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), ALL_MERCHANT_CARD_SLOTS (+53 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.08
Nodes (27): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, ChangePasswordPage() (+19 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.11
Nodes (31): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), minutesBetween(), primaryEarnLabel() (+23 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.18
Nodes (24): ref_next_navigation, CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel() (+16 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.19
Nodes (19): canEmployeeAccess(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+11 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.12
Nodes (19): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+11 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (51): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+43 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (46): PATCH(), DELETE(), POST(), GET(), POST(), GET(), POST(), deleteSchema (+38 more)

### Community 12 - "VisualPicker"
Cohesion: 0.29
Nodes (10): deleteCampaignMediaUrl(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), onCropConfirm(), onFidetoFilesSelected(), onSelfFileSelected(), removeFidetoImage() (+2 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (64): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+56 more)

### Community 14 - "jsonOk"
Cohesion: 0.13
Nodes (57): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+49 more)

### Community 15 - "loyalty-labels.ts"
Cohesion: 0.14
Nodes (31): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), buildView() (+23 more)

### Community 16 - "scan-session.ts"
Cohesion: 0.27
Nodes (16): formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter(), INSTANT_DUPLICATE_MS (+8 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.14
Nodes (18): ref_motion_react, react-dom, ref_react_dom_client, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps (+10 more)

### Community 18 - "cn"
Cohesion: 0.08
Nodes (29): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+21 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.26
Nodes (13): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), markWalletEventSeen(), fetchUnlockCardDetail(), cardFromUnlockEvent(), canEnqueueUnlockEvent() (+5 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.15
Nodes (15): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+7 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.08
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.21
Nodes (21): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+13 more)

### Community 23 - "loyalty-context.ts"
Cohesion: 0.13
Nodes (29): main(), dynamic, GET(), GET(), sortOrder(), CarteIndexPage(), dynamic, CardPage() (+21 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), CustomerLoginPage(), JoinMerchantPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.09
Nodes (27): dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), hostMatches(), hostnameOf() (+19 more)

### Community 26 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (12): AppLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, formatEurosFromCents() (+4 more)

### Community 27 - "prisma.ts"
Cohesion: 0.10
Nodes (26): POST(), POST(), FILTER_MAP, schema, dynamic, logCustomerQr(), POST(), runtime (+18 more)

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (39): TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+31 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "wallet-home.tsx"
Cohesion: 0.18
Nodes (10): DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, WalletHome(), WalletQrAction(), buildFifeLifeNextReward(), CustomerLoyaltyOverview, googleWalletEndpointForActiveCard() (+2 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.14
Nodes (30): computeAdPricing(), POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience() (+22 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.12
Nodes (29): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "deletion/confirm/route.ts"
Cohesion: 0.29
Nodes (7): AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), avatarUploadSchema, deletionConfirmSchema

### Community 38 - "demo-session.ts"
Cohesion: 0.15
Nodes (17): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+9 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.09
Nodes (25): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+17 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (25): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+17 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "types.ts"
Cohesion: 0.09
Nodes (32): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard() (+24 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.13
Nodes (13): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+5 more)

### Community 45 - "ref_next_headers"
Cohesion: 0.15
Nodes (18): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+10 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (40): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+32 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.13
Nodes (25): normalizeThresholdUnit(), parseRewardConditionsField(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft (+17 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (26): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+18 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (29): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+21 more)

### Community 52 - "playwright"
Cohesion: 0.10
Nodes (10): ref_node_fs_promises, playwright, OUT, OUT, shots, OUT, OUT, OUT (+2 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.16
Nodes (33): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+25 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (30): InsightRange, buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam(), getFreeMerchantStats() (+22 more)

### Community 58 - "HourlySchedulePicker"
Cohesion: 0.17
Nodes (10): addDaysToDateInput(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots(), scheduleDayError(), slotLabel() (+2 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.16
Nodes (24): GET(), CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PROFILE_HISTORY, ensureCustomerPreferences() (+16 more)

### Community 60 - "MerchantCardData"
Cohesion: 0.20
Nodes (7): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList()

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.13
Nodes (20): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, QrBlock(), cache, cacheKey() (+12 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (22): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+14 more)

### Community 66 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 67 - "vitest"
Cohesion: 0.05
Nodes (39): ref_node_fs, ref_node_path, ref_react_dom_server, vitest, outDir, outDir, outDir, dynamic (+31 more)

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

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (37): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+29 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "ref_next_server"
Cohesion: 0.08
Nodes (17): ref_next_server, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, basePrefs, consentEventCreateMany (+9 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.15
Nodes (16): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+8 more)

### Community 77 - "merchant-app-access.ts"
Cohesion: 0.33
Nodes (9): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), canOpenCaisse() (+1 more)

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "ads/[id]/confirm/route.ts"
Cohesion: 0.12
Nodes (32): stripe, POST(), GET(), POST(), topupSchema, isValidTopupAmountCents(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS (+24 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (22): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+14 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "CardTemplateConfig"
Cohesion: 0.24
Nodes (6): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardTemplateConfig

### Community 86 - "campaign-moderation-home.tsx"
Cohesion: 0.25
Nodes (5): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.19
Nodes (7): ref_fs, ref_path, ref_vitest_config, outDir, main(), outDir, shot()

### Community 102 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (15): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+7 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "requireUser"
Cohesion: 0.07
Nodes (34): GET(), GET(), GET(), DELETE(), GET(), dynamic, GET(), dynamic (+26 more)

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

### Community 118 - "commit/route.ts"
Cohesion: 0.20
Nodes (15): POST(), POST(), GET(), PERIOD_KEYS, requireCaisse(), requireCaissePermission(), requireMerchantStatsAccess(), requireStandardUser() (+7 more)

### Community 120 - "cards-index.tsx"
Cohesion: 0.09
Nodes (23): recharts, ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+15 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-hours-pricing.ts"
Cohesion: 0.12
Nodes (14): estimateSponsorPricing(), slotAmountCents(), SponsorWizard(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, priceSponsoredHours(), rateForParisHour() (+6 more)

### Community 125 - "GET"
Cohesion: 0.53
Nodes (5): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), shouldSendSseEvent()

### Community 126 - "exchange/route.ts"
Cohesion: 0.53
Nodes (5): GET(), POST(), QaExchangeBody, qaJson(), qaNotFound()

### Community 127 - "@prisma/client"
Cohesion: 0.14
Nodes (18): @prisma/client, BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+10 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.21
Nodes (16): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+8 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.35
Nodes (10): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+2 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.11
Nodes (30): zod, POST(), schema, schema, GET(), POST(), GET(), mapEmployee() (+22 more)

### Community 133 - "campaign-crud-routes.test.ts"
Cohesion: 0.06
Nodes (25): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess (+17 more)

### Community 134 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "bucketKey"
Cohesion: 0.53
Nodes (6): bucketKey(), enumerateBucketKeys(), buildCohorts(), buildComparison(), buildFrequentation(), fillSeries()

### Community 136 - "statistiques-scroll.test.ts"
Cohesion: 0.33
Nodes (4): appNav, globalsCss, layoutClient, statistiquesPanel

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.21
Nodes (13): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl() (+5 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "getEmployeeSession"
Cohesion: 0.23
Nodes (7): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 143 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 144 - "jsonError"
Cohesion: 0.09
Nodes (39): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), POST() (+31 more)

### Community 145 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "cashier-checkout.tsx"
Cohesion: 0.11
Nodes (29): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), CashierScanResult (+21 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.23
Nodes (13): buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation(), InvitationLookup (+5 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 154 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.22
Nodes (13): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents() (+5 more)

### Community 157 - "capture-employe-app-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 170 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

## Knowledge Gaps
- **853 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+848 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `webhook/route.ts`, `caisse-scan.ts`, `rbac.ts`, `employee-access.test.ts`, `employees/[id]/route.ts`, `campaign-crud-routes.test.ts`, `react`, `loyalty-program.ts`, `merchant-card-template-service.ts`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `loyalty-widget.ts`, `getEmployeeSession`, `card-editor-properties.tsx`, `push-client.ts`, `loyalty-labels.ts`, `jsonError`, `wallet-hydration.test.tsx`, `scan-session.ts`, `cashier-checkout.tsx`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `insight-period.ts`, `google-auth.ts`, `env.ts`, `loyalty-context.ts`, `marketing-topup-route.test.ts`, `loyalty-commit.ts`, `tarifs/page.tsx`, `campaign-audience.test.ts`, `campaigns/[id]/confirm/route.ts`, `card-template-schema.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `statistiques-scroll.test.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `caisse-client-number.test.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `card-deck.tsx`, `merchant-card-renderer.tsx`, `ref_next_server`, `unsubscribe/route.ts`, `ads/[id]/confirm/route.ts`, `qr.ts`, `marketing-balance.test.ts`, `ref_path`, `caisse-scan-route.test.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `@prisma/client`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `loyalty-program.ts`, `employee-session.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `jsonOk`, `loyalty-labels.ts`, `jsonError`, `cashier-checkout.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `loyalty-context.ts`, `google-auth.ts`, `env.ts`, `prisma.ts`, `loyalty-commit.ts`, `advantages-ui.tsx`, `wallet-home.tsx`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `scan/ui.tsx`, `types.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `demo-visual.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `vitest`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `merchant-app-access.ts`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `qr.ts`, `programme/ui.tsx`, `requireUser`, `cards-index.tsx`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `discover-page.tsx`, `merchant-card-template-service.ts`, `ref_next_navigation`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `scan-session.ts`, `wallet-hydration.test.tsx`, `cn`, `cashier-checkout.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `invitation/page.tsx`, `tarifs/page.tsx`, `app/ui.tsx`, `solde/ui.tsx`, `advantages-ui.tsx`, `wallet-home.tsx`, `loyalty-commit.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `types.ts`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `customer-loyalty-overview.ts`, `MerchantCardData`, `qr-cache.ts`, `vitest`, `card-deck.tsx`, `merchants-list.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `CardTemplateConfig`, `campaign-moderation-home.tsx`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `cards-index.tsx`, `qa-login/page.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _853 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06012176560121765 - nodes in this community are weakly interconnected._