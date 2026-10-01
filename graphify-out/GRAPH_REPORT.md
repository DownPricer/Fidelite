# Graph Report - Cartefidelité  (2026-10-01)

## Corpus Check
- 630 files · ~4,756,488 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3435 nodes · 10428 edges · 175 communities (150 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7994b18a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scan/route.ts
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
- SelfVisualCropper
- card-editor-canvas.tsx
- requireMutatingRequest
- loyalty-service.ts
- @prisma/client
- jsonOk
- cn
- use-wallet-unlock-animation.ts
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- caisse-client-number.test.ts
- google-auth.ts
- middleware.ts
- carte/page.tsx
- super-admin/auth/login/route.ts
- ad-detail.tsx
- advantages-ui.tsx
- layout-shell.tsx
- create-super-admin.ts
- ads/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- wallet-hydration.test.tsx
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- interactive-loyalty-card.tsx
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_path
- dependencies
- isGoogleWalletConfigured
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- wallet-home.tsx
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- fife-life/merchant-detail.tsx
- ref_path
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- isProduction
- card-editor-properties.tsx
- merchant-card-renderer.tsx
- AdvantagesEditor
- verify-viewports.mjs
- ref_next_server
- lib/campaign-worker.ts
- api-guard.ts
- MerchantDetailPage
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- caisse-scan.ts
- EmployeeDetailPanel
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
- customer-reward-progress.ts
- api-merchant-statistics-route.test.ts
- generate-pwa-icons.mjs
- loyalty-commit.ts
- ProgramConfigurator
- graphify reference: query, path, explain
- campaign-worker.test.ts
- jsonError
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- cards-index.tsx
- ad-confirm-route.test.ts
- card-deck.tsx
- campaign-confirm-route.test.ts
- sponsored-hours-pricing.ts
- GET
- vitest
- super-admin.test.ts
- prisma.ts
- merchants-list.tsx
- discover-page.tsx
- env.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- ref_node_fs
- merchant-ad-edit.test.ts
- landing-page.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- tarifs/page.tsx
- CreateMerchantWizard
- campaign-lifecycle.ts
- avatar/route.ts
- readJson
- EmployeeLoginScreen
- CampagnesPanel
- cashier-checkout.tsx
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- parametres/ui.tsx
- marketing-topup-route.test.ts
- customer-preferences-route.test.ts
- google-wallet.ts
- app/ui.tsx
- solde/ui.tsx
- capture-employe-app-screenshots.mjs
- capture-super-admin.mjs
- insight-demo-data.ts
- click/route.ts
- super-admin-ad-moderation.test.ts
- customer-qr.ts
- landing-header.tsx
- customer-qr-route.test.ts
- ExpandableQrCode
- SponsorWizard
- bucketKey
- trim-card-images.mjs
- invitation/page.tsx
- employee-app-capture.mjs
- super-admin-ad-detail-page.test.ts
- landing-footer.tsx
- CardEditorBackgroundCrop
- QuotaExceededError

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 202 edges
2. `jsonOk()` - 184 edges
3. `requireMutatingRequest()` - 123 edges
4. `prisma` - 116 edges
5. `vitest` - 107 edges
6. `react` - 98 edges
7. `clientIp()` - 94 edges
8. `@prisma/client` - 93 edges
9. `userAgent()` - 90 edges
10. `readJson()` - 88 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (175 total, 25 thin omitted)

### Community 0 - "scan/route.ts"
Cohesion: 0.14
Nodes (17): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), processCaisseScanByClientNumber(), ALLOWED_QR_HOSTS, extractFifeLifeQrToken() (+9 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (27): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), CARD_FONT_OPTIONS, CardFontId, CardDecorativeStyle (+19 more)

### Community 2 - "rbac.ts"
Cohesion: 0.08
Nodes (33): CaissePage(), CustomerDetailPage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+25 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (58): runResetAction(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), normalizeCardTemplateForSlot(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES (+50 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.08
Nodes (27): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, ChangePasswordPage() (+19 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.07
Nodes (42): DEMO_CONFIG, MODES, PROGRAM_STEPS, ProgramPreviewCard(), assertEarnProgramRules(), block(), buildNextBenefit(), centsToEarnAtLeast() (+34 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.16
Nodes (25): ref_next_navigation, CampagnesPage(), SoldeMarketingPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel() (+17 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.20
Nodes (17): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+9 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.12
Nodes (19): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetView(), pct(), ProgressCircle(), Props (+11 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (51): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+43 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (49): FILTER_MAP, GET(), GET(), POST(), GET(), POST(), DELETE(), deleteSchema (+41 more)

### Community 12 - "SelfVisualCropper"
Cohesion: 0.16
Nodes (12): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), onCropConfirm(), onFidetoFilesSelected() (+4 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.13
Nodes (32): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+24 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.12
Nodes (56): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+48 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.16
Nodes (21): GET(), sortOrder(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance() (+13 more)

### Community 16 - "@prisma/client"
Cohesion: 0.12
Nodes (35): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+27 more)

### Community 17 - "jsonOk"
Cohesion: 0.12
Nodes (30): GET(), POST(), GET(), GET(), GET(), GET(), GET(), PATCH() (+22 more)

### Community 18 - "cn"
Cohesion: 0.11
Nodes (23): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), DashboardLayout(), AppNav() (+15 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.24
Nodes (13): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), fetchUnlockCardDetail(), cardFromUnlockEvent(), canEnqueueUnlockEvent(), shouldDeferUnlockPlayback() (+5 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.15
Nodes (15): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+7 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.05
Nodes (46): ref_next_font_google, next-themes, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput() (+38 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.21
Nodes (21): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+13 more)

### Community 23 - "caisse-client-number.test.ts"
Cohesion: 0.23
Nodes (11): findUserByCustomerNumber(), deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate (+3 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (27): GET(), GET(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie() (+19 more)

### Community 25 - "middleware.ts"
Cohesion: 0.21
Nodes (17): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+9 more)

### Community 26 - "carte/page.tsx"
Cohesion: 0.12
Nodes (22): main(), dynamic, GET(), GET(), dynamic, MerchantProfilePage(), CarteIndexPage(), dynamic (+14 more)

### Community 27 - "super-admin/auth/login/route.ts"
Cohesion: 0.14
Nodes (23): POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST(), POST() (+15 more)

### Community 28 - "ad-detail.tsx"
Cohesion: 0.13
Nodes (13): AdDetailPage(), AdImage, AdRequestDetail, AdStatsPayload, AdStatus, AdVisualEditor(), onFileChange(), AuditRow (+5 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (20): recharts, MerchantCardsPage(), ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS, SuperAdminStatsPage() (+12 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "ads/[id]/confirm/route.ts"
Cohesion: 0.17
Nodes (28): computeAdPricing(), POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience() (+20 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), saveDraft() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "wallet-hydration.test.tsx"
Cohesion: 0.21
Nodes (15): mergeMerchantCardUpdate(), parseCardTemplateFromPayload(), DEFAULT_QR_ELEMENT_ID, ensureDefaultQrElement(), hasRenderReadyTemplate(), normalizePublishedWalletTemplate(), PublishedWalletTemplate, templateHasVisibleQr() (+7 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.19
Nodes (15): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+7 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (34): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+26 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "interactive-loyalty-card.tsx"
Cohesion: 0.09
Nodes (30): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+22 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.13
Nodes (13): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+5 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.12
Nodes (19): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.08
Nodes (32): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+24 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.16
Nodes (20): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, containsForbiddenTechnicalLabel(), ELEMENT_TYPE_LABELS, qrVisuallySquareInPixels(), CardTemplateConfig (+12 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.11
Nodes (31): CardPage(), dynamic, activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry (+23 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.09
Nodes (16): ref_node_fs_promises, ref_node_path, playwright, OUT, goto(), OUT, tiers, OUT (+8 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "isGoogleWalletConfigured"
Cohesion: 0.15
Nodes (27): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+19 more)

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
Cohesion: 0.10
Nodes (31): GET(), CarteIdentitePage(), AccountPage(), ParametresPage(), ProEntryPage(), SPACES, PREVIEW_BENEFITS, PREVIEW_HISTORY (+23 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.13
Nodes (20): ref_motion_react, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCodeProps, DiscoverIconLink() (+12 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.12
Nodes (22): ref_react_dom_server, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey() (+14 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.13
Nodes (25): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+17 more)

### Community 66 - "fife-life/merchant-detail.tsx"
Cohesion: 0.13
Nodes (19): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+11 more)

### Community 67 - "ref_path"
Cohesion: 0.11
Nodes (13): ref_fs, ref_path, ref_vitest_config, outDir, main(), outDir, shot(), source() (+5 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "isProduction"
Cohesion: 0.27
Nodes (7): isProduction(), assertSuperAdminProductionConfig(), isSuperAdminAllowedEmailsConfigured(), setSuperAdminEntryCookie(), SUPER_ADMIN_ENTRY_COOKIE, superAdminEntryCookieOptions(), loadMiddleware()

### Community 71 - "card-editor-properties.tsx"
Cohesion: 0.12
Nodes (21): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, NextRewardStylePicker(), qrOverlapsOthers(), BACKGROUND_FIT_LABELS, DATA_KEY_LABELS (+13 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (28): LinearGauge(), LoyaltyWidgetProgressInput, MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode (+20 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "ref_next_server"
Cohesion: 0.12
Nodes (10): ref_next_server, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, pushSubscriptionDeleteMany, pushSubscriptionUpsert (+2 more)

### Community 76 - "lib/campaign-worker.ts"
Cohesion: 0.15
Nodes (20): jose, backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+12 more)

### Community 77 - "api-guard.ts"
Cohesion: 0.19
Nodes (14): POST(), GET(), schema, GET(), DELETE(), GET(), parseUserAgent(), cookieOptions() (+6 more)

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.12
Nodes (29): stripe, POST(), GET(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent() (+21 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (24): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage() (+16 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "caisse-scan.ts"
Cohesion: 0.16
Nodes (16): main(), prisma, requiredEnv(), upsertEmployee(), buildScanResult(), processCaisseScan(), CAISSE_GRANT_TTL_MS, assertQrUsable() (+8 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

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

### Community 101 - "customer-reward-progress.ts"
Cohesion: 0.22
Nodes (13): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+5 more)

### Community 102 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "loyalty-commit.ts"
Cohesion: 0.20
Nodes (18): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+10 more)

### Community 105 - "ProgramConfigurator"
Cohesion: 0.23
Nodes (10): modeTitle(), ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction(), publish(), saveDraft(), unitForMode() (+2 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.07
Nodes (40): GET(), PATCH(), GET(), POST(), GET(), DELETE(), POST(), POST() (+32 more)

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

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-hours-pricing.ts"
Cohesion: 0.20
Nodes (9): slotAmountCents(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, rateForParisHour(), SPONSORED_HOUR_RATE_CENTS, SponsoredDayBreakdown, SponsoredDaySelection (+1 more)

### Community 125 - "GET"
Cohesion: 0.53
Nodes (5): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), shouldSendSseEvent()

### Community 126 - "vitest"
Cohesion: 0.15
Nodes (12): vitest, decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval(), customerMembershipFindMany, customerPreferencesFindMany, campaignQuotaUsageFindUnique (+4 more)

### Community 127 - "super-admin.test.ts"
Cohesion: 0.17
Nodes (16): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+8 more)

### Community 128 - "prisma.ts"
Cohesion: 0.13
Nodes (19): POST(), topupSchema, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf() (+11 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.25
Nodes (6): DiscoverPage(), Merchant, pickRotatingAd(), Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "env.ts"
Cohesion: 0.09
Nodes (16): web-push, dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), isWebPushConfigured() (+8 more)

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.17
Nodes (19): GET(), GET(), mapEmployee(), employeeLoginUrl(), GET(), mapEmployee(), POST(), requireEmployee() (+11 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "ref_node_fs"
Cohesion: 0.13
Nodes (6): ref_node_fs, outDir, outDir, outDir, LOGO_PATH, PNG_SIGNATURE

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "tarifs/page.tsx"
Cohesion: 0.13
Nodes (15): AppLoginPage(), HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS (+7 more)

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 143 - "avatar/route.ts"
Cohesion: 0.33
Nodes (7): DELETE(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), avatarUploadSchema

### Community 144 - "readJson"
Cohesion: 0.14
Nodes (23): zod, POST(), schema, POST(), schema, GET(), markReadSchema, PATCH() (+15 more)

### Community 145 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "cashier-checkout.tsx"
Cohesion: 0.11
Nodes (30): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+22 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (17): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+9 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 154 - "google-wallet.ts"
Cohesion: 0.22
Nodes (23): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+15 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.22
Nodes (13): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents() (+5 more)

### Community 157 - "capture-employe-app-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 160 - "click/route.ts"
Cohesion: 0.18
Nodes (12): log(), loop(), requestShutdown(), sleep(), GET(), computeAdLifecycleStatus(), runAdLifecycleTick(), isSafeAdUrl() (+4 more)

### Community 161 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 162 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 163 - "landing-header.tsx"
Cohesion: 0.32
Nodes (6): MoonIcon(), SunIcon(), isInternalRoute(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 164 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 165 - "ExpandableQrCode"
Cohesion: 0.40
Nodes (4): ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr()

### Community 167 - "bucketKey"
Cohesion: 0.53
Nodes (6): bucketKey(), enumerateBucketKeys(), buildCohorts(), buildComparison(), buildFrequentation(), fillSeries()

### Community 168 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 171 - "super-admin-ad-detail-page.test.ts"
Cohesion: 0.40
Nodes (4): adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

## Knowledge Gaps
- **883 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+878 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1187 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `scan/route.ts`, `card-template-schema.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `react`, `ref_node_fs`, `loyalty-program.ts`, `landing-page.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-widget.ts`, `merchant-ad-edit.test.ts`, `tarifs/page.tsx`, `card-editor-canvas.tsx`, `campaign-lifecycle.ts`, `loyalty-service.ts`, `@prisma/client`, `push-client.ts`, `use-wallet-unlock-animation.ts`, `env.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `caisse-client-number.test.ts`, `google-auth.ts`, `customer-preferences-route.test.ts`, `middleware.ts`, `insight-period.ts`, `marketing-topup-route.test.ts`, `profile-page.tsx`, `super-admin-campaign-moderation.test.ts`, `click/route.ts`, `ads/[id]/confirm/route.ts`, `package.json`, `[id]/merchant-detail.tsx`, `customer-qr-route.test.ts`, `ExpandableQrCode`, `statistiques-panel.tsx`, `super-admin-ad-moderation.test.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `super-admin-ad-detail-page.test.ts`, `ref_fs_promises`, `demo-routing.test.ts`, `wallet-hydration.test.tsx`, `card-editor-polish.test.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `qr-cache.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `ref_path`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `isProduction`, `merchant-card-renderer.tsx`, `ref_next_server`, `lib/campaign-worker.ts`, `stripe.ts`, `caisse-scan.ts`, `marketing-balance.test.ts`, `cashier-checkout.tsx`, `customer-reward-progress.ts`, `api-merchant-statistics-route.test.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `card-deck.tsx`, `campaign-confirm-route.test.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchants-list.tsx`, `discover-page.tsx`, `merchant-card-template-service.ts`, `loyalty-program.ts`, `ref_next_navigation`, `loyalty-widget-view.tsx`, `tarifs/page.tsx`, `card-editor-canvas.tsx`, `@prisma/client`, `cn`, `cashier-checkout.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `app/ui.tsx`, `ad-detail.tsx`, `advantages-ui.tsx`, `solde/ui.tsx`, `layout-shell.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `landing-header.tsx`, `ExpandableQrCode`, `wallet-hydration.test.tsx`, `scan/ui.tsx`, `invitation/page.tsx`, `interactive-loyalty-card.tsx`, `src/app/page.tsx`, `card-editor-polish.test.ts`, `qa-login.ts`, `wallet-home.tsx`, `qr-cache.ts`, `fife-life/merchant-detail.tsx`, `card-editor-properties.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campaign-moderation-home.tsx`, `campagnes/ui.tsx`, `customer-reward-progress.ts`, `notifications-center.tsx`, `cards-index.tsx`, `card-deck.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `prisma.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `env.ts`, `loyalty-program.ts`, `employee-session.ts`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `requireMutatingRequest`, `loyalty-service.ts`, `campaign-lifecycle.ts`, `jsonOk`, `readJson`, `cashier-checkout.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `google-auth.ts`, `carte/page.tsx`, `super-admin/auth/login/route.ts`, `google-wallet.ts`, `advantages-ui.tsx`, `layout-shell.tsx`, `create-super-admin.ts`, `click/route.ts`, `card-editor.tsx`, `package.json`, `ads/[id]/confirm/route.ts`, `customer-qr.ts`, `wallet-hydration.test.tsx`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `insight-stats.ts`, `demo-visual.ts`, `wallet-home.tsx`, `loyalty-service.test.ts`, `platform-stats.ts`, `card-editor-properties.tsx`, `merchant-card-renderer.tsx`, `lib/campaign-worker.ts`, `api-guard.ts`, `super-admin-session.ts`, `caisse-scan.ts`, `customer-reward-progress.ts`, `loyalty-commit.ts`, `jsonError`, `cards-index.tsx`, `vitest`, `super-admin.test.ts`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _883 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scan/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09848484848484848 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0797979797979798 - nodes in this community are weakly interconnected._